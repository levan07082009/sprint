"use server";

import { createServerClient, getProfile } from "@/lib/supabase-server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getRecommendedGigs() {
  const { userId } = await auth();
  if (!userId) {
    console.log("No user ID");
    return [];
  }

  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('gigs')
      .select(`
        *,
        employer:profiles!gigs_employer_id_fkey(
          id,
          display_name,
          avatar_url,
          trust_score,
          role
        )
      `)
      .eq('status', 'ACTIVE')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error("Failed to fetch recommended gigs:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch recommended gigs:", error);
    return [];
  }
}

export async function getMyPostedGigs() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const profile = await getProfile(userId);
    if (!profile) return [];

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('gigs')
      .select(`
        *,
        applications(count)
      `)
      .eq('employer_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Failed to fetch my posted gigs:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch my posted gigs:", error);
    return [];
  }
}

const createGigSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  budget: z.coerce.number().positive("Budget must be positive"),
  category: z.string().optional(),
  urgency: z.enum(["STANDARD", "ASAP"]),
  location: z.string().optional(),
});

export async function createGig(prevState: any, formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const profile = await getProfile(userId);

    if (!profile || profile.role === "STUDENT") {
      return { error: "Only employers can post gigs" };
    }

    const rawData = {
      title: formData.get("title"),
      description: formData.get("description"),
      budget: formData.get("budget"),
      category: formData.get("category"),
      urgency: formData.get("urgency") || "STANDARD",
      location: formData.get("location"),
    };

    const validatedData = createGigSchema.parse(rawData);
    const supabase = createServerClient();

    const { error } = await supabase
      .from('gigs')
      .insert({
        employer_id: profile.id,
        title: validatedData.title,
        description: validatedData.description,
        budget: validatedData.budget,
        required_skills: validatedData.category ? [validatedData.category] : [],
        urgency: validatedData.urgency,
        location: validatedData.location,
        status: 'ACTIVE',
      });

    if (error) {
      console.error("Gig creation error:", error);
      return { error: "Failed to create gig" };
    }

    revalidatePath("/business");
    revalidatePath("/individual");
    revalidatePath("/student");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: "Failed to create gig" };
  }
}

export async function applyToGig(prevState: any, formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const profile = await getProfile(userId);

    if (!profile || profile.role !== "STUDENT") {
      return { error: "Only students can apply to gigs" };
    }

    const gigId = formData.get("gigId") as string;
    const coverNote = formData.get("coverNote") as string;
    const proposedRate = formData.get("proposedRate");

    if (!gigId || !coverNote || coverNote.length < 10) {
      return { error: "Invalid input data" };
    }

    const supabase = createServerClient();

    // Check if already applied
    const { data: existing } = await supabase
      .from('applications')
      .select('id')
      .eq('gig_id', gigId)
      .eq('applicant_id', profile.id)
      .maybeSingle();

    if (existing) {
      return { error: "You have already applied to this gig" };
    }

    const { error } = await supabase
      .from('applications')
      .insert({
        gig_id: gigId,
        applicant_id: profile.id,
        cover_note: coverNote,
        proposed_rate: proposedRate ? parseFloat(proposedRate as string) : null,
        status: 'PENDING',
      });

    if (error) {
      console.error("Application creation error:", error);
      return { error: "Failed to submit application" };
    }

    revalidatePath("/student");
    revalidatePath("/student/applications");
    return { success: true };
  } catch (error) {
    console.error("Apply to gig error:", error);
    return { error: "Failed to submit application" };
  }
}

export async function completeGigAndPay(gigId: string, amount: number) {
  try {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const profile = await getProfile(userId);

    if (!profile || (profile.role !== "BUSINESS" && profile.role !== "INDIVIDUAL")) {
      return { error: "Only employers can complete gigs" };
    }

    const supabase = createServerClient();

    // Verify gig ownership
    const { data: gig } = await supabase
      .from('gigs')
      .select('id, employer_id, status')
      .eq('id', gigId)
      .single();

    if (!gig || gig.employer_id !== profile.id) {
      return { error: "Gig not found or unauthorized" };
    }

    if (gig.status === "COMPLETED") {
      return { error: "Gig is already completed" };
    }

    // Get accepted application
    const { data: application } = await supabase
      .from('applications')
      .select('applicant_id')
      .eq('gig_id', gigId)
      .eq('status', 'ACCEPTED')
      .single();

    if (!application) {
      return { error: "No accepted application found" };
    }

    // Create transaction
    const { error: txError } = await supabase
      .from('transactions')
      .insert({
        gig_id: gigId,
        payer_id: profile.id,
        payee_id: application.applicant_id,
        amount: amount,
        status: 'RELEASED',
        payment_method: 'QR_CODE',
      });

    if (txError) {
      console.error("Transaction creation error:", txError);
      return { error: "Failed to create transaction" };
    }

    // Update gig status
    const { error: gigError } = await supabase
      .from('gigs')
      .update({ status: 'COMPLETED', updated_at: new Date().toISOString() })
      .eq('id', gigId);

    if (gigError) {
      console.error("Gig update error:", gigError);
      return { error: "Failed to update gig status" };
    }

    revalidatePath("/business");
    revalidatePath("/individual");
    return { success: true };
  } catch (error) {
    console.error("Failed to complete gig:", error);
    return { error: "Failed to complete gig and record payment" };
  }
}

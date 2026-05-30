"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getRecommendedGigs() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // For students, fetch active gigs
  try {
    const gigs = await prisma.gig.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        employer: {
          include: {
            profile: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 20
    });
    return gigs;
  } catch (error) {
    console.error("Failed to fetch recommended gigs:", error);
    return [];
  }
}

export async function getMyPostedGigs() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    // Find the Prisma User ID linked to the Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) throw new Error("User not found");

    const gigs = await prisma.gig.findMany({
      where: {
        employerId: user.id
      },
      include: {
        _count: {
          select: { applications: true }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return gigs;
  } catch (error) {
    console.error("Failed to fetch my posted gigs:", error);
    return [];
  }
}

const createGigSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  budget: z.coerce.number().positive("Budget must be positive"),
  requiredSkills: z.string(), // We'll just take one category for now
  urgency: z.enum(["STANDARD", "ASAP"]),
});

export async function createGig(prevState: any, formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, role: true }
    });

    if (!user || user.role === "STUDENT") {
      return { error: "Only employers can post gigs" };
    }

    const rawData = {
      title: formData.get("title"),
      description: formData.get("description"),
      budget: formData.get("budget"),
      requiredSkills: formData.get("category"),
      urgency: formData.get("urgency") || "STANDARD",
    };

    const validatedData = createGigSchema.parse(rawData);

    await prisma.gig.create({
      data: {
        employerId: user.id,
        title: validatedData.title,
        description: validatedData.description,
        budget: validatedData.budget,
        requiredSkills: [validatedData.requiredSkills],
        urgency: validatedData.urgency,
        status: "ACTIVE", // Set immediately to ACTIVE
      }
    });

    revalidatePath("/business");
    revalidatePath("/individual");
    revalidatePath("/student"); // Revalidate student feed too
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: "Failed to create gig" };
  }
}

const applyGigSchema = z.object({
  gigId: z.string(),
  coverNote: z.string().min(10, "Cover note must be at least 10 characters"),
  proposedRate: z.coerce.number().positive("Rate must be positive").optional(),
});

export async function applyToGig(prevState: any, formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, role: true }
    });

    if (!user || user.role !== "STUDENT") {
      return { error: "Only students can apply to gigs" };
    }

    const rawData = {
      gigId: formData.get("gigId"),
      coverNote: formData.get("coverNote"),
      proposedRate: formData.get("proposedRate") || undefined,
    };

    const validatedData = applyGigSchema.parse(rawData);

    // Ensure they haven't already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        gigId: validatedData.gigId,
        applicantId: user.id,
      }
    });

    if (existingApplication) {
      return { error: "You have already applied to this gig" };
    }

    await prisma.application.create({
      data: {
        gigId: validatedData.gigId,
        applicantId: user.id,
        coverNote: validatedData.coverNote,
        proposedRate: validatedData.proposedRate,
        status: "PENDING",
      }
    });

    revalidatePath("/student");
    revalidatePath("/student/applications");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: "Failed to submit application" };
  }
}

export async function completeGigAndPay(gigId: string, amount: number) {
  try {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, role: true }
    });

    if (!user || (user.role !== "BUSINESS" && user.role !== "INDIVIDUAL")) {
      return { error: "Only employers can complete gigs" };
    }

    // Verify gig ownership and status
    const gig = await prisma.gig.findUnique({
      where: { id: gigId }
    });

    if (!gig || gig.employerId !== user.id) {
      return { error: "Gig not found or unauthorized" };
    }

    if (gig.status === "COMPLETED") {
      return { error: "Gig is already completed" };
    }

    // Update Gig status to COMPLETED and create a Transaction record in one transaction
    await prisma.$transaction([
      prisma.gig.update({
        where: { id: gigId },
        data: { status: "COMPLETED" }
      }),
      prisma.transaction.create({
        data: {
          gigId: gigId,
          amount: amount,
          status: "RELEASED",
          paymentMethod: "QR_CODE",
        }
      })
    ]);

    revalidatePath("/business");
    revalidatePath("/individual");
    return { success: true };
  } catch (error) {
    console.error("Failed to complete gig:", error);
    return { error: "Failed to complete gig and record payment" };
  }
}

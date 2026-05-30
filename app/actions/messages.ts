"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

export async function getMessages(conversationId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: {
          include: {
            profile: true
          }
        }
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    return messages;
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return [];
  }
}

const sendMessageSchema = z.object({
  conversationId: z.string(),
  content: z.string().min(1, "Message cannot be empty").max(1000, "Message too long"),
});

export async function sendMessage(conversationId: string, content: string) {
  try {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) return { error: "User not found" };

    const validatedData = sendMessageSchema.parse({ conversationId, content });

    // 1. Save to MongoDB via Prisma
    const message = await prisma.message.create({
      data: {
        conversationId: validatedData.conversationId,
        content: validatedData.content,
        senderId: user.id,
      },
      include: {
        sender: {
          include: {
            profile: true
          }
        }
      }
    });

    // 2. Broadcast via Supabase Realtime
    // We send to a channel named after the conversationId
    await supabase.channel(`chat_${validatedData.conversationId}`).send({
      type: 'broadcast',
      event: 'new_message',
      payload: message
    });

    return { success: true, message };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    console.error("Failed to send message:", error);
    return { error: "Failed to send message" };
  }
}

import { getMessages } from "@/app/actions/messages";
import ChatInterface from "@/components/ChatInterface";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function MessageRoute({ params }: { params: { id: string } }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true }
  });

  if (!user) redirect("/sign-in");

  const messages = await getMessages(params.id);

  return (
    <div className="h-[calc(100vh-64px)] md:h-screen w-full">
      {/* Header */}
      <div className="h-16 border-b border-neutral-800 bg-neutral-900/50 flex items-center px-6">
        <h1 className="text-lg font-semibold text-white">Conversation</h1>
        <div className="ml-4 px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 text-xs font-medium border border-violet-500/20">
          Live
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="h-[calc(100%-64px)]">
        <ChatInterface 
          initialMessages={messages} 
          conversationId={params.id} 
          currentUserId={user.id} 
        />
      </div>
    </div>
  );
}

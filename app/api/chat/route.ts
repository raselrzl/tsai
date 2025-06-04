// app/api/chat/route.ts

/* import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"; */
import { getEmbedding, openai } from "@/lib/openai";
import prisma from "@/lib/db/prisma";
import index from "@/lib/db/pinecone";
import {
  ChatCompletionMessageParam,
  ChatCompletionSystemMessageParam,
} from "openai/resources/index.mjs";

export async function POST(request: Request) {
  try {
   /*  const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    } */

    const body = await request.json();
    const messages: ChatCompletionMessageParam[] = body.messages;
    const recentMessages = messages.slice(-6);

    // Create embedding from recent messages content
    const embedding = await getEmbedding(
      recentMessages.map((m) => m.content).join("\n")
    );

    // Query Pinecone with userId filter
    const pineconeResult = await index.query({
      vector: embedding,
      topK: 1,
      /* filter: { userId: { $eq: userId } }, */
    });

    // Extract matched note IDs
    const matchedNoteIds = pineconeResult.matches.map((m) => m.id);
    console.log("📘 Pinecone matched note IDs:", matchedNoteIds);

    // Fetch notes from DB
    const relevantNotes = await prisma.note.findMany({
      where: { id: { in: matchedNoteIds } },
    });

    console.log("📚 Relevant notes found:", relevantNotes.length);

    // Construct system message with fallback
    const systemMessage: ChatCompletionSystemMessageParam = {
      role: "system",
      content:
        relevantNotes.length > 0
          ? "You are a helpful AI assistant. Use the following notes to answer the user's question:\n\n" +
            relevantNotes
              .map((note) => `Title: ${note.title}\n${note.content}`)
              .join("\n\n")
          : "You are a helpful AI assistant. The user has no saved notes, so answer generally.",
    };

    // Call OpenAI chat completion with streaming
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...recentMessages],
    });

    // Stream OpenAI response chunks to client
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          for await (const chunk of chatResponse) {
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) {
              console.log("🧠 OpenAI chunk:", content);
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (e) {
          console.error("Stream error:", e);
          controller.error(e);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("API /api/chat error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

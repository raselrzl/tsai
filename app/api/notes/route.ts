import indexPromise from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import { createNotesSchema } from "@/lib/validation/note";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const index = await indexPromise; // wait for initialized index

    const body = await request.json();
    const parseData = createNotesSchema.safeParse(body);
    if (!parseData.success) {
      console.log(parseData.error);
      return Response.json({ error: "Invalid data" }, { status: 400 });
    }
    const { title, content } = parseData.data;
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const note = await prisma.$transaction(async (tx) => {
      const note = await tx.note.create({
        data: { title, content, userId },
      });

      const embedding = await getEmbedding(
        note.title + "\n\n" + (note.content ?? "")
      );

      await index.upsert([
        {
          id: note.id,
          values: embedding,
          metadata: {
            title: note.title,
            content: note.content,
            userId: note.userId,
          },
        },
      ]);

      return note;
    });

    return Response.json(
      { message: "Note created successfully", note },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/notes error:", error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
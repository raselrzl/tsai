import prisma from "@/lib/db/prisma";
import { createNotesSchema } from "@/lib/validation/note";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseData = createNotesSchema.safeParse(body);

    if (!parseData.success) {
      console.log(parseData.error);
      return Response.json({ error: "Invalid data" }, { status: 400 });
    }

    const { title, content } = parseData.data;
    const { userId } = await auth(); // ✅ Await this call

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId,
      },
    });

    return Response.json({ message: "Note created successfully", note }, { status: 201 });

  } catch (error) {
    console.error("POST /api/notes error:", error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}

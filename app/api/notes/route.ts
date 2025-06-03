import prisma from "@/lib/db/prisma";
import { createNotesSchema } from "@/lib/validation/note";
import { useAuth } from "@clerk/nextjs";

// app/api/route.ts
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parseData = createNotesSchema.safeParse(body);

    if (!parseData.success) {
      console.log(parseData.error);
      return Response.json({ error: "Error processing data" }, { status: 400 });
    }

    const { title, content } = parseData.data;
    const { userId } = useAuth();

    if (!userId) {
      return Response.json({ error: "Un authorizes" }, { status: 401 });
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId,
      },
    });

    return new Response(
      JSON.stringify({ message: "Data received successfully!" }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error processing data" }), {
      status: 500,
    });
  }
}

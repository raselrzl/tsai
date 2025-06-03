// app/notes/page.tsx
import { auth } from "@clerk/nextjs/server";
import { Note as NoteType } from "@prisma/client";
import Note from "../component/Note";
import prisma from "@/lib/db/prisma";

export default async function NotesPage() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Please sign in to view your notes.</div>;
  }

  try {
    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    if (notes.length === 0) {
      return <div>You have no notes yet.</div>;
    }

    return (
      <div className="space-y-4 p-4">
        <h2 className="text-xl font-semibold">Your Notes</h2>
        <ul className="space-y-2">
          {notes.map((note: NoteType) => (
            <Note key={note.id} note={note} />
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    console.error("Error fetching notes:", error);
    return <div>Failed to load notes.</div>;
  }
}

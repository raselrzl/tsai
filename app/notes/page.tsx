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

  const notes = await prisma.note.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  if (notes.length === 0) {
    return <div>You have no notes yet.</div>;
  }

  return (
    <div className="flex justify-center">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 w-full max-w-7xl">
    {notes.map((note: NoteType) => (
      <Note key={note.id} note={note} />
    ))}
  </div>
</div>

  );
}

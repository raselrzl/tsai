// app/notes/page.tsx
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db/prisma';
import { Note } from '@/lib/generated/prisma';

export default async function Notes() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return <div>Please sign in to view your notes.</div>;
    }

    const notes = await prisma.note.findMany({
      where: { userId },
    });

    if (notes.length === 0) {
      return <div>You have no notes yet.</div>;
    }

    return (
      <div>
        <h2>Your Notes</h2>
        <ul>
          {notes.map((note: Note) => (
            <li key={note.id}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    console.error('Error fetching notes:', error);
    return <div>Failed to load notes.</div>;
  }
}

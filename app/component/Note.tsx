// app/notes/component/Note.tsx
import { Note as NoteType } from "@prisma/client";

interface NoteProps {
  note: NoteType;
}

export default function Note({ note }: NoteProps) {
  return (
    <li className="border p-4 rounded shadow-sm">
      <h3 className="text-lg font-bold">{note.title}</h3>
      <p className="text-sm text-gray-700">{note.content}</p>
      <p className="text-xs text-gray-500">
        Updated: {note.updatedAt.toLocaleString()}
      </p>
      <p className="text-xs text-gray-400">
        Created: {note.createdAt.toLocaleString()}
      </p>
    </li>
  );
}

// app/notes/component/Note.tsx
import { Note as NoteType } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
interface NoteProps {
  note: NoteType;
}

export default function Note({ note }: NoteProps) {
  return (
    <>
      <Card className="w-full max-w-md mx-auto mb-4 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">{note.title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Created: {note.createdAt.toLocaleString()} | Updated: {note.updatedAt.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 whitespace-pre-line">{note.content}</p>
      </CardContent>
    </Card>
    </>
  );
}

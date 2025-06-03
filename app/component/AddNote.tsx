import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNotesSchema, CreateNotesSchema } from "@/lib/validation/note";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface AddNoteFormData {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AddNoteDialog({ open, setOpen }: AddNoteFormData) {
  const form = useForm<CreateNotesSchema>({
    resolver: zodResolver(createNotesSchema),
  });

  async function onSubmit(input: CreateNotesSchema) {
    alert(input);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new note.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            {...form.register("title")}
            className="input"
          />
          <input
            type="text"
            placeholder="Content"
            {...form.register("content")}
            className="input"
          />
          <button type="submit">Create Note</button>
        </form>
        <DialogClose asChild>
          <button onClick={() => setOpen(false)}>Close</button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

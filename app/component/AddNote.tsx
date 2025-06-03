import { useForm, Controller } from "react-hook-form";
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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"; // Assuming these are components from your UI library
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AddNoteFormData {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AddNoteDialog({ open, setOpen }: AddNoteFormData) {
  const form = useForm<CreateNotesSchema>({
    resolver: zodResolver(createNotesSchema),
  });

  const onSubmit = (input: CreateNotesSchema) => {
    alert(JSON.stringify(input)); // Handle form data submission
    setOpen(false); // Close the dialog on form submission
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new note.
          </DialogDescription>
        </DialogHeader>
        
      <Card>
        <CardContent>
              <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="title"
                      placeholder="Enter note title"
                      className="input"
                    />
                  </FormControl>
                  <FormDescription>Enter a title for your note.</FormDescription>
                  <FormMessage>{form.formState.errors.title?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Content Field */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="content">Content</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="content"
                      placeholder="Enter note content"
                      className="input"
                    />
                  </FormControl>
                  <FormDescription>Enter content for your note.</FormDescription>
                  <FormMessage>{form.formState.errors.content?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" variant={"outline"}>
              Create Note
            </Button>
          </form>
        </Form>
        </CardContent>
      </Card>

        {/* Dialog Close Button */}
        <DialogClose asChild className="flex flex-row mx-auto justify-center">
          <Button onClick={() => setOpen(false)} className="w-20" variant={"destructive"}>Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

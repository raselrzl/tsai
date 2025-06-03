import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createNotesSchema } from "@/lib/validation/note";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ Correct inferred type
type CreateNoteInput = z.infer<typeof createNotesSchema>;

interface AddNoteFormData {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AddNoteDialog({ open, setOpen }: AddNoteFormData) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateNoteInput>({
    resolver: zodResolver(createNotesSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (input: CreateNoteInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error("Error creating note");
      }

      form.reset();
      router.refresh();
      setOpen(false);

      const data = await response.json();
      console.log(data);

      alert("Note created successfully!");
    } catch (error: any) {
      console.error("Error:", error);
      setError("Failed to create note. Please try again.");
      alert("Failed to create note. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
                        />
                      </FormControl>
                      <FormDescription>Enter a title for your note.</FormDescription>
                      <FormMessage />
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
                        />
                      </FormControl>
                      <FormDescription>Enter content for your note.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button type="submit" variant="outline" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  ) : (
                    "Create Note"
                  )}
                </Button>

                {/* Optional: Display server error */}
                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

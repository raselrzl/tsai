/* import { useForm } from "react-hook-form";
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
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                      <FormDescription>
                        Enter a title for your note.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                      <FormDescription>
                        Enter content for your note.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  variant="outline"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  ) : (
                    "Create Note"
                  )}
                </Button>
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
 */

'use client';

import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface AddNoteFormData {
  open: boolean;
  setOpen: (open: boolean) => void;
}

type FormData = {
  title: string;
  content: string;
};

export default function AddNoteDialog({ open, setOpen }: AddNoteFormData) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = async (input: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) throw new Error("Failed to create note");

      reset();
      router.refresh();
      setOpen(false);
      alert("Note created successfully!");
    } catch (error: any) {
      console.error("Error:", error);
      setError("Failed to create note. Please try again.");
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block font-medium mb-1">Title</label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Enter note title"
                />
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block font-medium mb-1">Content</label>
                <Textarea
                  id="content"
                  {...register("content")}
                  placeholder="Enter note content"
                />
              </div>

              {/* Submit */}
              <Button type="submit" variant="outline" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                ) : (
                  "Create Note"
                )}
              </Button>

              {/* Error */}
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

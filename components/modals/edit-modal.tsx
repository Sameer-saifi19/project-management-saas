"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProjectSchema,
  createProjectSchemaType,
} from "@/schema/project";
import { generateSlug } from "@/utils/slug-generator";
import { updateProject } from "@/server/project";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  project: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
  };
};

export function EditProjectModal({
  open,
  setOpen,
  project,
}: Props) {
  const [isPending, startTransition] =
    useTransition();

  const form =
    useForm<createProjectSchemaType>({
      resolver: zodResolver(
        createProjectSchema
      ),
      defaultValues: {
        name: project.name,
        slug: project.slug,
        description: project.description ?? "",
      },
    });

  const name = form.watch("name");

  useEffect(() => {
    if (!name) return;
    form.setValue(
      "slug",
      generateSlug(name),
      { shouldValidate: true }
    );
  }, [name, form]);

  function onSubmit(
    values: createProjectSchemaType
  ) {
    startTransition(async () => {
      const res = await updateProject(project.id, values);

      if (!res?.success) {
        toast.error(res?.message);
        return;
      }

      toast.success("Project updated");
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit Project
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              onSubmit
            )}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending
                ? "Updating..."
                : "Update Project"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

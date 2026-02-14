"use client";

import { useEffect, useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createProjectSchemaType, createProjectSchema } from "@/schema/project";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { generateSlug } from "@/utils/slug-generator";
import { createProject } from "@/server/project";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export function CreateProjectSheet() {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<createProjectSchemaType>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  const name = form.watch("name");

  // Auto slug generation
  useEffect(() => {
    if (!name) {
      form.setValue("slug", "");
      return;
    }

    const generated = generateSlug(name);

    form.setValue("slug", generated, {
      shouldValidate: true,
    });
  }, [name, form]);

  function onSubmit(values: createProjectSchemaType) {
    startTransition(async () => {
      try {
        const res = await createProject(values);

        if (res.status === 201) {
          toast.success("Project created");
          form.reset();
          setOpen(false); // close sheet
        } else {
          if (!res.success) {
            toast.error(res.message);
          }
        }
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <SheetTrigger asChild>
        <Button>
          {" "}
          <Plus /> Create new Project
        </Button>
      </SheetTrigger>

      {/* Sheet Panel */}
      <SheetContent
        showCloseButton={false}
        side="right"
        className="w-full px-4 py-4 sm:max-w-lg overflow-y-auto"
      >
        <SheetTitle className="text-xl mt-4 font-semibold">
          Create New Project
        </SheetTitle>

        <div className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* NAME */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome Project" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SLUG */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Url</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="project.com/org/project/"
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DESCRIPTION */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SUBMIT */}
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "creating..." : "Create Project"}
              </Button>
            </form>
          </Form>
        </div>
        <SheetClose asChild>
          <Button variant="outline">Cancel</Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}

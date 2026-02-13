"use client";

import { useEffect, useTransition } from "react";
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
import { generateSlug } from "@/utils/slug-generator";
import { authClient } from "@/lib/auth-client";
import { createProject } from "@/server/project";
import { toast } from "sonner";

export function CreateProjectForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<createProjectSchemaType>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  const name = form.watch("name");

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
    console.log(values)
    startTransition(async () => {
      try {
        const res = await createProject(values);
        if (res.status === 201) {
          toast.success("project created");
        } else {
          if (!res.success) {
            toast.error(res.message);
          }
        }
        form.reset();
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  }


  return (
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
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} disabled />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Optional project description..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {" "}
          {isPending ? "creating..." : "Create project"}
        </Button>
      </form>
    </Form>
  );
}

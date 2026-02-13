"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrgSchema, createOrgSchemaType } from "@/schema/organization";
import { generateSlug } from "@/utils/slug-generator";
import { useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";

export default function CreateOrgForm() {
  const form = useForm<createOrgSchemaType>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  const nameValue = form.watch("name");

  useEffect(() => {
    if (nameValue) {
      form.setValue("slug", generateSlug(nameValue), {
        shouldValidate: true,
      });
    }
  }, [nameValue, form]);

  function onSubmit(data: createOrgSchemaType) {
    console.log(data);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-w-xl"
        >
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>

                <FormControl>
                  <Input placeholder="Enter category name" {...field} />
                </FormControl>

                <FormDescription>
                  This will be used to generate the slug.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Slug */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>

                <FormControl>
                  <Input placeholder="auto-generated-slug" {...field} />
                </FormControl>

                <FormDescription>This slug is used as unique identifier for organizations.</FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>

                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="Enter description"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Create Category</Button>
        </form>
      </Form>
    </>
  );
}

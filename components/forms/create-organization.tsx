"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrgSchema, createOrgSchemaType } from "@/schema/organization";
import { generateSlug } from "@/utils/slug-generator";
import { useEffect, useTransition } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { createOrganization } from "@/server/organization";
import { toast } from "sonner";

export default function CreateOrgForm() {
  const [isPending, startTransition] = useTransition();

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

  function onSubmit(formdata: createOrgSchemaType) {
    startTransition(async () => {
      try {
        const res = await createOrganization(formdata);

        if (res.status === 201) {
          toast.success("Organization created");
        } else {
          if (!res.success) {
            toast.error(res.message);
          }
        }
        form.reset()
      } catch (error) {
        toast.error("Something went wrong")
      }
    });
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
                  <Input placeholder="Enter organization name" {...field} />
                </FormControl>

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
                  <Input
                    placeholder="slug will auto generate from name"
                    {...field}
                  />
                </FormControl>

                <FormDescription>
                  This slug is used as unique identifier for organizations.
                </FormDescription>

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
                    rows={8}
                    placeholder="Enter description"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Create organization</Button>
        </form>
      </Form>
    </>
  );
}

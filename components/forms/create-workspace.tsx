'use client'

import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Loader from "../global/loader";
import { useTransition } from "react";
import {
  createWorkspaceSchema,
  createWorkspaceSchemaType,
} from "@/schema/workspace-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateSlug } from "@/utils/slug-generator";
import { createNewWorkspace } from "@/server/workspace";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { organization } from "@/lib/auth-client";

interface CreateWorkspaceFormProps {
  onCreated?: () => void;
}

export default function CreateWorkspaceForm({
  onCreated,
}: CreateWorkspaceFormProps) {
  const form = useForm<createWorkspaceSchemaType>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  function onSubmit(data: createWorkspaceSchemaType) {
    startTransition(async () => {
      try {
        const createResult = await createNewWorkspace(data);

        if (!createResult.success) {
          if (createResult.error === "Organization slug already taken") {
            form.setError("slug", {
              type: "server",
              message: "slug is taken! use a different one",
            });
          } else {
            toast.error(createResult.error ?? "Error creating workspace");
          }
          return;
        }

        if (createResult.data?.id) {
          await organization.setActive({
            organizationId: createResult.data.id,
          });
        }

        toast.success("New workspace created");

        if (onCreated) {
          onCreated();
        }

        router.push(`/w/${createResult.data?.slug}/projects`);
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  {...field}
                  id="name"
                  type="text"
                  required
                  placeholder="Workspace name"
                  onChange={(e) => {
                    field.onChange(e);

                    const slug = generateSlug(e.target.value);
                    form.setValue("slug", slug, {
                      shouldValidate: true,
                    });
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="slug">Slug</FieldLabel>
                <Input
                  {...field}
                  id="slug"
                  type="text"
                  required
                  placeholder="my-org"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <FieldGroup className="flex items-end mt-6">
          <Button type="submit" className="" size={"sm"}>
            {isPending ? <Loader text="creating" /> : "Create Workspace"}
          </Button>
        </FieldGroup>
      </form>
    </>
  );
}

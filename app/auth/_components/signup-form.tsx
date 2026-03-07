"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { signupSchema, signupSchemaType } from "@/schema/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmail } from "@/server/user";
import { GoogleBtn } from "./google-btn";
import { toast } from "sonner";
import Loader from "@/components/global/loader";

export default function SignupForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<signupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(data: signupSchemaType) {
    startTransition(async () => {
      try {
        const result = await createUserWithEmail(data);

        if (!result.success) {
          const errorMessage =
            typeof result.error === "string"
              ? result.error
              : (result.error?.errors?.[0] ?? "An error occurred");
          toast.error(errorMessage);
          return;
        }

        toast.success("Account created successfully");
        router.push("/auth/sign-in");
      } catch (error) {
        console.error(error);
        toast.error("something went wrong");
      }
    });
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    required
                    placeholder="m@example.com"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>

                  <div className="relative">
                    <Input
                      {...field}
                      id="password"
                      aria-invalid={fieldState.invalid}
                      type={showPassword ? "text" : "password"}
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    <Button
                      className="absolute top-0 right-1 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </Field>
              )}
            />

            <FieldGroup>
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Loader text="Creating..." /> : "Create account"}
                </Button>
                <GoogleBtn signUp />
                <FieldDescription className="px-6 text-center">
                  Already have an account?{" "}
                  <Link href="/auth/sign-in">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

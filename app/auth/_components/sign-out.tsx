"use client";

import Loader from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  size?:
    | "default"
    | "xs"
    | "sm"
    | "lg"
    | "icon"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg"
    | null
    | undefined;
  variant?:
    | "default"
    | "link"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}

export const SignOutButton = ({
  size,
  variant,
}: Props) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleClick() {
    await signOut({
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("You have logged out. See you soon!");
          router.push("/auth/sign-in");
        },
      },
    });
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      disabled={isPending}
      className="cursor-pointer"
      size={size}
    >
      <LogOut />
      {isPending ? <Loader /> : "sign out"}
    </Button>
  );
};

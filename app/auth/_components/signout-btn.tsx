"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const SignOutButton = () => {
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
      variant="destructive"
      disabled={isPending}
      className="cursor-pointer"
    >
      <LogOut className="h-[1.2rem] w-[1.2rem]" />
      Sign out
    </Button>
  );
};

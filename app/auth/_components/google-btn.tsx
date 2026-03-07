"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
<<<<<<< HEAD
import { FaGoogle } from "react-icons/fa";
=======
>>>>>>> prod
import { toast } from "sonner";

interface OauthButtonProps {
  signUp?: boolean;
}

export const GoogleBtn = ({ signUp }: OauthButtonProps) => {
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    setIsPending(true);

    await signIn.social({
      provider: "google",
<<<<<<< HEAD
      callbackURL: "/setup",
=======
      callbackURL: "/dashboard",
>>>>>>> prod
      errorCallbackURL: "/auth/sign-in/error",
      fetchOptions: {
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    });

    setIsPending(false);
  };

  const action = signUp ? "up" : "in";

  return (
    <Button
      className="w-full flex gap-2"
      variant="outline"
      onClick={handleClick}
      disabled={isPending}
    >
<<<<<<< HEAD
      <FaGoogle size={20} />
=======
>>>>>>> prod
      Sign {action} with Google
    </Button>
  );
};

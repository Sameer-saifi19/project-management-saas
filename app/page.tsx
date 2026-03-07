<<<<<<< HEAD
'use client'

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function Page() {
  const {data: session} = authClient.useSession();
  return (
    <>
      <div className="flex flex-col gap-6 items-center justify-center h-screen">
        <h1 className="text-4xl font-semibold">Welcome {session?.user.name}</h1>
        <div className="flex items-center gap-4">
          <Button variant={"outline"}>
            <Link href={"/auth/sign-in"} >Sign in</Link>
          </Button>
          <Button>
            <Link href={"/auth/sign-up"} >Sign up</Link>
          </Button>
        </div>
      </div>
=======
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center justify-center h-screen gap-6">
        <h1 className="text-3xl font-bold tracking-wide">Home</h1>
        <div className="space-x-4">
          <Button variant={"outline"}>
            <Link href={"/auth/sign-up"}>Sign up</Link>
          </Button>
          <Button>
            <Link href={"/auth/sign-in"}>Sign in</Link>
          </Button>
        </div>
      </main>
>>>>>>> prod
    </>
  );
}

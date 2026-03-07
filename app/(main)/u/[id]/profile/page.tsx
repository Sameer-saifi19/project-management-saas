import { auth } from "@/lib/auth";
import ProfileClient from "./client";
import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  return (
    <>
      <main className="flex flex-col gap-6 p-4 w-full max-7-wxl">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">My Profile</h1>
          <p className="text-sm text-muted-foreground">
            Manage your profile and user settings
          </p>
        </div>
        <ProfileClient
          imageUrl={session?.user.image as string}
          email={session?.user.email as string}
          initialName={session?.user.name as string}
        />
      </main>
    </>
  );
}

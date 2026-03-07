import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SignOutButton } from "../auth/_components/sign-out";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <>
      <div className="flex flex-col space-y-6 items-center justify-center h-screen">
        <pre className="text-base overflow-clip w-full max-w-lg">
          {JSON.stringify(session, null, 2)}
        </pre>
        <SignOutButton />
      </div>
    </>
  );
}

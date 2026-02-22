import { auth } from "@/lib/auth";
import { listOrganization } from "@/server/organization";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { status: 403, success: false, message: "Unauthorized", data: null };
  }

  const redirection = await listOrganization();
  if (redirection.data?.length) {
    redirect(`/w/${redirection.data[0].slug}`);
  }

  return (
    <>
    <div className="flex items-center justify-center h-screen">
      <h1>Setting up your workspace...</h1>
    </div>
    </>
  );
}

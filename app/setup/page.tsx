import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getInitialOrganization, listOrganization } from "@/server/organization";
import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { status: 403, success: false, message: "Unauthorized", data: null };
  }

  const redirectRule = await getInitialOrganization(session.user.id);
  const allOrganization = await listOrganization()

  if(allOrganization)
  
  return (
    <>
      <h1>Setting up your workspace</h1>
    </>
  );
}

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Orgpage from "./client";

export default async function OrganizationList() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <h1>Unauthorized</h1>;
  }

  const orgs = await auth.api.listOrganizations({
    headers: await headers(),
  });

  return (
    <div>
      <Orgpage organizations={orgs} />
    </div>
  );
}

"use client";

import { authClient } from "@/lib/auth-client";

export default function Page() {
  const { data: allOrg } = authClient.useListOrganizations();

  return (
    <div className="flex flex-col items-center gap-4">

      {allOrg?.map((item) => (
        <h1 key={item.id}>{item.name}</h1>
      ))}
    </div>
  );
}
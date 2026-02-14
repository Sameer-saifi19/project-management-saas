"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const onUserAuthenticate = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      return null;
    }

    const orgs = await auth.api.listOrganizations({
      headers: await headers(),
    });

    return orgs.length;
  } catch (error) {
    console.error("Org check failed:", error);
    return null;
  }
};

export const checkSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session
};

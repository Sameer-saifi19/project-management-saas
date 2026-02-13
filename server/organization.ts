"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const createOrganization = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  const metadata = { someKey: "someValue" };
  try {
    const data = await auth.api.createOrganization({
      body: {
        name,
        slug,
        logo: "https://example.com/logo.png",
        metadata,
        userId: "some_user_id",
        keepCurrentActiveOrganization: false,
      },
      headers: await headers(),
    });


  } catch (error) {}
};

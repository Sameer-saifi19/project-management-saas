"use server";

import { auth } from "@/lib/auth";
import { generateSlug } from "@/utils/slug-generator";

export const onAuthenticatedUser = async (name: string, slug: string, userId: string) => {
  try {
    const normalizeSlug = generateSlug(slug);

    const createOrg = await auth.api.createOrganization({
      body: {
        name,
        slug: `${normalizeSlug}-workspace`,
        userId,
        keepCurrentActiveOrganization: true,
      },
    });

    if (!createOrg) {
      return { status: 400, success: false, message: "Cannot create org" };
    }

    return {
      status: 201,
      success: true,
      message: "Workspace created successfully",
    };
  } catch (error) {
    console.error("onAuthenticatedUser server error", error);
    return { status: 500, success: false, message: "Something went wrong" };
  }
};


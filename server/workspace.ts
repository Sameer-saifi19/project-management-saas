"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createWorkspaceSchemaType } from "@/schema/workspace-schema";
import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface Props {
  name: string;
  slug: string;
  userId: string;
}

export const createWorkspaceOnSignup = async ({
  name,
  slug,
  userId,
}: Props) => {
  try {
    const data = await auth.api.createOrganization({
      body: {
        name,
        slug,
        userId,
      },
    });

    if (!data) {
      return { success: false, status: 409 };
    }

    return { success: true, status: 201, data: data };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "something went wrong",
    };
  }
};

export const verifyAccessToWorkspace = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const isUserInWorkspace = await prisma.member.findFirst({
      where: {
        userId: session?.user.id,
      },
      select: {
        organizationId: true,
      },
    });

    return { data: isUserInWorkspace };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "something went wrong",
    };
  }
};

export const getAllUserWorkspace = async () => {
  try {
    const data = await auth.api.listOrganizations({
      headers: await headers(),
    });

    if (!data) {
      return { success: false, status: 404 };
    }

    return { success: true, data: data };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "something went wrong",
    };
  }
};

export const createNewWorkspace = async ({
  name,
  slug,
}: createWorkspaceSchemaType) => {
  try {
    const checkSlug = await auth.api.checkOrganizationSlug({
      body: {
        slug,
      },
    });

    if (!checkSlug) {
      return { success: false, error: "slug is taken! use a different one" };
    }

    const response = await auth.api.createOrganization({
      body: { name, slug, keepCurrentActiveOrganization: false },
      headers: await headers(),
    });

    if (!response) {
      return {
        success: false,
        error: "Failed to create workspace",
      };
    }

    revalidatePath(`/w/${response.slug}`, "layout");

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Something went wrong",
    };
  }
};

export const removeWorkspaceImage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { error: "Not authenticated" };

  await prisma.organization.update({
    where: { id: session.session.activeOrganizationId as string },
    data: {
      logo: null,
    },
  });

  revalidatePath("/profile");
  return { success: true };
};

export const getFullWorkspace = async () => {
  try {
    const data = await auth.api.getFullOrganization({
      query: {
        membersLimit: 100,
      },
      headers: await headers(),
    });

    if (!data) {
      return { success: false };
    }

    return { success: true, data: data };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Something went wrong",
    };
  }
};

export const redirectAfterDelete = async () => {
  try {
    const organizations = await auth.api.listOrganizations({
      headers: await headers(),
    });



    revalidatePath(`/w/${organizations[0].slug}`, "layout");

    return { data: organizations, success: true };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Something went wrong",
    };
  }
};

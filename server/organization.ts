"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  createOrgSchema,
  createOrgSchemaType,
  updateOrgSchemaType,
} from "@/schema/organization";
import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const getInitialOrganization = async (userId: string) => {
  try {
    const findFirstOrg = await prisma.organization.findFirst();
    if (!findFirstOrg) return { status: 409, message: "First org not found" };

    const setActive = await auth.api.setActiveOrganization({
      body: {
        organizationId: findFirstOrg.id,
        organizationSlug: findFirstOrg.slug,
      },

      headers: await headers(),
    });

    if (!setActive) {
      return {
        success: false,
        status: 400,
        message: "Could not set active organization",
      };
    }

    return { status: 200, data: setActive };
  } catch (error) {
    console.log("get initial org", error);
    return { status: 500, message: "Internal server error" };
  }
};

export const createOrganization = async (formData: createOrgSchemaType) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { status: 403, success: false, message: "Unauthorized", data: null };
  }

  const parsed = createOrgSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, message: "Invalid data" };
  }

  const { name, slug, description } = parsed.data;

  const normalizedSlug = slug.toLowerCase().trim().replace(/\s+/g, "-");
  try {
    const checkSlug = await auth.api.checkOrganizationSlug({
      body: {
        slug: normalizedSlug,
      },
    });

    if (!checkSlug) {
      return {
        status: 409,
        message: "An organization is already exist with this slug",
      };
    }

    const data = await auth.api.createOrganization({
      body: {
        name,
        slug: normalizedSlug,
        description,
        keepCurrentActiveOrganization: true,
      },
      headers: await headers(),
    });

    revalidatePath("/w", "layout");

    if (!data) {
      return {
        success: false,
        status: 500,
        message: "Error creating organization",
      };
    }

    return {
      success: true,
      status: 201,
      message: "Organization created successfully",
      data: data,
    };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        status: error.status,
        message: error.message,
        code: error.statusCode,
      };
    }

    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};

export const listOrganization = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        status: 403,
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }
    const data = await auth.api.listOrganizations({
      headers: await headers(),
    });

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        status: error.status,
        message: error.message,
        code: error.statusCode,
      };
    }

    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};

export const updateOrganization = async (
  formData: updateOrgSchemaType,
  orgId: string,
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { status: 403, success: false, message: "Unauthorized", data: null };
  }

  const parsed = createOrgSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, message: "Invalid data" };
  }

  const { name, slug, description } = parsed.data;

  const normalizedSlug = slug.toLowerCase().trim().replace(/\s+/g, "-");

  try {
    const data = await auth.api.updateOrganization({
      body: {
        data: {
          name,
          slug: normalizedSlug,
          description,
          logo: "default logo",
        },
        organizationId: orgId,
      },

      headers: await headers(),
    });

    if (!data) {
      return {
        success: false,
        status: 500,
        message: "Error updating organization",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Organization updated successfully",
      data: data,
    };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        status: error.status,
        message: error.message,
        code: error.statusCode,
      };
    }

    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};

export const getFullOrganization = async (slug: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { status: 403, success: false, message: "Unauthorized", data: null };
  }

  try {
    const data = await auth.api.getFullOrganization({
      query: {
        organizationSlug: slug,
        membersLimit: 100,
      },

      headers: await headers(),
    });

    if (!data) {
      return {
        success: false,
        status: 500,
        message: "Error getting organization details",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Organization fetched successfully",
      data: data,
    };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        status: error.status,
        message: error.message,
        code: error.statusCode,
      };
    }

    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};

export const deleteOraganization = async (orgId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { status: 403, success: false, message: "Unauthorized", data: null };
  }

  try {
    const data = await auth.api.deleteOrganization({
      body: {
        organizationId: orgId,
      },
      headers: await headers(),
    });

    if (!data) {
      return {
        success: false,
        status: 500,
        message: "Error deleting workspace",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Workspace deleted successfully",
      data: data,
    };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        status: error.status,
        message: error.message,
        code: error.statusCode,
      };
    }

    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};

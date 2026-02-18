"use server";

import { auth } from "@/lib/auth";
import {
  createOrgSchema,
  createOrgSchemaType,
  updateOrgSchemaType,
} from "@/schema/organization";
import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { checkSession } from "./user";

export const createOrganization = async (formData: createOrgSchemaType) => {
  await checkSession();

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
  await checkSession();

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
  await checkSession();

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

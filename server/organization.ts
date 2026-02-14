"use server";

import { auth } from "@/lib/auth";
import { createOrgSchema, createOrgSchemaType } from "@/schema/organization";
import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const createOrganization = async (formData: createOrgSchemaType) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      status: 401,
      message: "Unauthorized",
    };
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

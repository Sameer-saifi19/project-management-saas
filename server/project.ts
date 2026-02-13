'use server'

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createOrgSchema, createOrgSchemaType } from "@/schema/organization";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";

export const createProject = async (values: createOrgSchemaType) => {
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

  const parsed = createOrgSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: "Invalid data" };
  }

  const { name, slug, description } = parsed.data;
  const normalizeSlug = slug.toLowerCase().trim().replace(/\s+/g, "-");

  try {
    const checkSlug = await prisma.project.findUnique({
      where: {
        slug: normalizeSlug,
      },
    });

    if (checkSlug) {
      return {
        status: 409,
        message: "An organization is already exist with this slug",
      };
    }

    const data = await prisma.project.create({
      data: {
        name,
        slug: normalizeSlug,
        description,
        organizationId: session.session.activeOrganizationId as string,
        userId: session.user.id,
      },
    });

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

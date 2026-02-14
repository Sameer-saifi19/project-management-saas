"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createProjectSchema, createProjectSchemaType } from "@/schema/project";
import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const createProject = async (values: createProjectSchemaType) => {
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

  const parsed = createProjectSchema.safeParse(values);
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

    revalidatePath("/", "layout")

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

export const getAllProjects = async (orgId: string) => {
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

  try {
    const projects = await prisma.project.findMany({
      where: {
        organizationId: orgId,
      },
    });

    if (!projects) {
      return {
        success: false,
        status: 500,
        message: "Error fetching projects",
        data: null,
      };
    }

    return { status: 200, data: projects, message: "All projects" };
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

export const deleteProject = async (projectId: string) => {
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

  try {
    const result = await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    if (!result) {
      return { status: 409, success: false, message: "Cannot delete project" };
    }

    revalidatePath('/dashboard', 'layout')
    return {
      status: 200,
      data: result,
      message: "Project deleted successfully",
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

export const updateProject = async (
  projectId: string,
  values: createProjectSchemaType,
) => {
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

  const parsed = createProjectSchema.safeParse(values);
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

    const findProject = await prisma.project.findFirst({
      where: {
        id: projectId
      }
    })

    const result = await prisma.project.update({
      where: {
          id: findProject?.id,
      },
      data: {
        name,
        slug: normalizeSlug,
        description,
        organizationId: session.session.activeOrganizationId as string,
        userId: session.user.id,
      },
    });

    if (!result) {
      return { status: 500, success: false, message: "Error updating project" };
    }
    
    revalidatePath('/dashboard', "layout")

    return {
      status: 200,
      data: result,
      message: "Project updated successfully",
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

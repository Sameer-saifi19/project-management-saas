"use server";

import { auth } from "@/lib/auth";
<<<<<<< HEAD
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
      data: createOrg
    };
  } catch (error) {
    console.error("onAuthenticatedUser server error", error);
    return { status: 500, success: false, message: "Something went wrong" };
  }
};

=======
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import {
  signinSchema,
  signinSchemaType,
  signupSchema,
  signupSchemaType,
} from "@/schema/auth-schema";
import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

export const createUserWithEmail = async (data: signupSchemaType) => {
  try {
    const parsed = signupSchema.safeParse(data);

    if (!parsed.success) {
      return {
        success: false,
        status: 409,
        error: z.treeifyError(parsed.error),
      };
    }

    const { name, email, password } = parsed.data;

    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    return { success: true, status: 201 };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "User creation failed",
    };
  }
};

export const loginUserWithEmail = async (data: signinSchemaType) => {
  try {
    const parsed = signinSchema.safeParse(data);

    if (!parsed.success) {
      return {
        success: false,
        error: z.treeifyError(parsed.error),
      };
    }

    const { email, password } = parsed.data;

    await auth.api.signInEmail({
      body: {
        email,
        password,
      },

      headers: await headers(),
    });

    return { status: 200, success: true };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "User login failed",
    };
  }
};

export const updateUserImage = async (formData: FormData) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) return { message: "Not authenticated" };

    const file = formData.get("file") as File;

    if (!file || file.size === 0) return { error: "No file provided" };
    if (!file.type.startsWith("image/")) return { error: "Must be an image" };
    if (file.size > 2 * 1024 * 1024) return { error: "Max size is 2MB" };

    const bytes = await file.arrayBuffer();
    const base64 = `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "user-avatars",
      public_id: `user-${session.user.id}`,
      overwrite: true,
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
        { quality: "auto" },
      ],
    });

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: result.secure_url,
      },
    });

    revalidatePath("/profile");
    return { success: true, url: result.secure_url };
  } catch (error) {
    console.error(error);
    return { status: 500, success: false };
  }
};

export const updateWorkspaceImage = async (formData: FormData) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) return { message: "Not authenticated" };

    const file = formData.get("file") as File;

    if (!file || file.size === 0) return { error: "No file provided" };
    if (!file.type.startsWith("image/")) return { error: "Must be an image" };
    if (file.size > 2 * 1024 * 1024) return { error: "Max size is 2MB" };

    const bytes = await file.arrayBuffer();
    const base64 = `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "user-avatars",
      public_id: `user-${session.user.id}`,
      overwrite: true,
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
        { quality: "auto" },
      ],
    });

    await prisma.organization.update({
      where: {
        id: session.session.activeOrganizationId as string,
      },
      data: {
        logo: result.secure_url,
      },
    });

    revalidatePath("/profile");
    return { success: true, url: result.secure_url };
  } catch (error) {
    console.error(error);
    return { status: 500, success: false };
  }
};

export const removeUserImage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { error: "Not authenticated" };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: null },
  });

  revalidatePath("/profile");
  return { success: true };
};

export const findOrgSlugById = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const activeOrgId = session?.session.activeOrganizationId;

    if (!activeOrgId) {
      return { success: false };
    }

    const data = await prisma.organization.findUnique({
      where: {
        id: activeOrgId,
      },
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
      error: "something went wrong",
    };
  }
};
>>>>>>> prod

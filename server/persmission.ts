"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";

type ProjectPermission = "create" | "update" | "delete";

export async function hasProjectPermission(
  permission: ProjectPermission
): Promise<boolean> {
  try {
    const { success, error } = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          project: [permission],
        },
      },
    });
    if (error) return false;
    return success;
  } catch {
    return false;
  }
}

export const isAdmin = async () => {
  try {
    const { success, error } = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          project: ["create"],
        },
      },
    });

    if (error) {
      return {
        status: 500,
        success: false,
        message: "Error getting permissions",
        data: null,
      };
    }

    return success;
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

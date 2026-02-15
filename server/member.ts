"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { APIError } from "better-auth/api";
import { checkSession } from "./user";

export const getAllOrgMembers = async (orgId: string) => {
  await checkSession();
  try {
    const data = await prisma.member.findMany({
      where: {
        organizationId: orgId,
      },
      include: {
        user: true,
      },
    });

    if (!data) {
      return {
        status: 500,
        success: false,
        message: "Error getting members",
        data: null,
      };
    }

    return { status: 200, success: true, data: data };
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

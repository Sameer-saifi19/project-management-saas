"use server";

import { auth } from "@/lib/auth";
import { checkSession } from "./user";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";


export const sendOrganizationInvitation = async ({
  email
}: {email: string}) => {
  await checkSession();
  try {
    const data = await auth.api.createInvitation({
      body: {
        email: email,
        role: "member",
        resend: true,
      },
      headers: await headers(),
    });

    if (!data) {
      return {
        status: 500,
        success: false,
        message: "Error Sending Invitation",
        data: null,
      };
    }

    return {
      success: true,
      status: 200,
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

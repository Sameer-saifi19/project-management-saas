import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { organization } from "better-auth/plugins";
import transporter from "./nodemailer";
import OrganizationInvitationEmail from "@/components/emails/org-invitation";
import { render } from "@react-email/render";
import { ac, admin, member, owner } from "./permissions";
import { nextCookies } from "better-auth/next-js";
import { onAuthenticatedUser } from "@/server/user";
import { redirect } from "next/navigation";
import { activeOrganization, listOrganization } from "@/server/organization";
import OrganizationList from "@/app/(my-app)/w/organizations/page";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await onAuthenticatedUser(
            `${user.name} Workspace`,
            user.name,
            user.id,
          );
        },
      },
    },
  },
  session: {
    expiresIn: 24 * 60 * 60,
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  plugins: [
    organization({
      schema: {
        organization: {
          additionalFields: {
            description: {
              type: "string",
              input: true,
              required: false,
            },
          },
        },
      },
      async sendInvitationEmail(data) {
        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/accept-invitation/${data.id}`;
        const htmlContent = await render(
          OrganizationInvitationEmail({
            email: data.email,
            invitedByUsername: data.inviter.user.name,
            invitedByEmail: data.inviter.user.email,
            teamName: data.organization.name,
            inviteLink,
          }),
        );
        await transporter.sendMail({
          from: `${process.env.NODEMAILER_USER}`,
          to: data.email,
          subject: `You have been invited to ${data.organization.name} Workspace by ${data.inviter.user.name}`,
          html: htmlContent,
        });
      },
      ac,
      roles: {
        owner,
        member,
        admin,
      },
    }),
    nextCookies(),
  ],
});

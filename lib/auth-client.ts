import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";
import { ac, admin, member, owner } from "./permissions";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    organizationClient({
      ac,
      roles: {
        owner,
        admin,
        member,
      },
    }),
  ],
});

export const { signUp, signIn, signOut, useSession } = authClient;

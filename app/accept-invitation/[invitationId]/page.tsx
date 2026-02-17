"use server";

import { auth } from "@/lib/auth";
import { checkSession } from "@/server/user";
import { headers } from "next/headers";
import { toast } from "sonner";

type Props = {
  params: { invitationId: string };
};

export default async function AcceptInvitation({ params }: Props) {
  const { invitationId } = await params;
  

  return (
    <>
      <h1>{invitationId}</h1>
    </>
  )
}

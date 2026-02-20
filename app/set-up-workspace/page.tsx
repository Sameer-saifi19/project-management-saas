'use client'

import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";

export default function PostAuthPage() {
  const { data: organizations } = authClient.useListOrganizations();

  useEffect(() => {
    const fetchOrgList = async () => {
      const { data, error } = await authClient.organization.list();
      if (data?.length === 0) {
        redirect("/onboarding");
      }
    };

    fetchOrgList();
  });

  if(!organizations){
    return null
  } 

  redirect(`/w/${organizations[0].slug}`);
}

'use client'

import DashboardNavbar from "@/components/global/navbar";
import DashboardSidebar from "@/components/global/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
    const {data: activeOrganizationId} = authClient.useActiveOrganization()
    const {data: session} = authClient.useSession()
  return (
    <div>
      <SidebarProvider>
        <DashboardSidebar userId={session?.user.id as string} activeOrganizationId={activeOrganizationId?.slug as string}/>
        <main className="w-full">
            <DashboardNavbar/>
            <div className="px-12 flex items-center justify-center py-8">
                {children}
            </div>
        </main>
        
        </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;

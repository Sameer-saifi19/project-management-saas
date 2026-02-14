'use client'

import DashboardSidebar from "@/components/global/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
    const {data: activeOrganizationId} = authClient.useActiveOrganization()
  return (
    <div>
      <SidebarProvider>
        <DashboardSidebar activeOrganizationId={activeOrganizationId?.slug as string}/>
        <main className="w-full">
            <div className="px-4">
                {children}
            </div>
        </main>
        
        </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;

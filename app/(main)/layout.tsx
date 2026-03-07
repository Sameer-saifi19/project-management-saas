"use client";

import DashboardNavbar from "@/components/global/navbar";
import DashboardSidebar from "@/components/global/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  const { data: session } = authClient.useSession();
  const { data: activeOrganization } = authClient.useActiveOrganization();
  
  return (
    <div>
      <SidebarProvider>
        <DashboardSidebar
          userId={session?.user.name.replace(/\s+/g, "-") as string}
          activeOrganizationId={activeOrganization?.slug as string}
        />
        <main className="min-w-0 flex-1">
          <DashboardNavbar />
          <div className="px-12 flex items-center justify-center py-8">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;

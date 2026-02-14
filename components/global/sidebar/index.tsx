import Link from "next/link";
import { menuItems } from "./menu-items";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import OrgSwitcher from "../org-switcher";

type Props = {
  activeOrganizationId: string;
};

export default function DashboardSidebar({ activeOrganizationId }: Props) {
  const sidebarItems = menuItems(activeOrganizationId);
  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <OrgSwitcher />
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>

          <SidebarGroup>
            <SidebarGroupLabel>
              Workspace
            </SidebarGroupLabel>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    <Link href={item.url} className="flex items-center gap-2">
                      {item.icon}
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>
              Personal Settings
            </SidebarGroupLabel>
            <SidebarMenu>
              
            </SidebarMenu>
          </SidebarGroup>

        </SidebarContent>
        <SidebarFooter></SidebarFooter>
      </Sidebar>
    </>
  );
}

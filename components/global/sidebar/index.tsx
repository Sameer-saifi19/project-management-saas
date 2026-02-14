import Link from "next/link";
import { menuItems, personalMenuItems } from "./menu-items";
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
  useSidebar,
} from "@/components/ui/sidebar";
import OrgSwitcher from "../org-switcher";

type Props = {
  activeOrganizationId: string;
  userId: string
};

export default function DashboardSidebar({ activeOrganizationId, userId }: Props) {
  const workspaceItems = menuItems(activeOrganizationId);
  const personalItems = personalMenuItems(userId)
  const {open} = useSidebar()
  return (
    <>
      <Sidebar collapsible="icon" >
        <SidebarHeader>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>

          <SidebarGroup className="space-y-4">
            <SidebarGroupLabel>
              Workspace
            </SidebarGroupLabel>
            {open ? <OrgSwitcher /> : null }
            <SidebarMenu>
              {workspaceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-2">
                      {item.icon}
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

              <SidebarSeparator/>

          <SidebarGroup>
            <SidebarGroupLabel>
              Personal Settings
            </SidebarGroupLabel>
            <SidebarMenu>
             {personalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-2">
                      {item.icon}
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

        </SidebarContent>
        <SidebarFooter></SidebarFooter>
      </Sidebar>
    </>
  );
}

"use client";

import CreateWorkspaceDialog from "@/components/modals/create-workspace";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSidebar } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { Building } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WorkspaceSwitch() {
  const { open } = useSidebar();
  const {
    data: workspaces,
    isPending,
    refetch,
  } = authClient.useListOrganizations();

  const { data: activeOrganization } = authClient.useActiveOrganization();

  const router = useRouter();

  useEffect(() => {
    if (activeOrganization) {
      refetch();
    }
  }, [activeOrganization, refetch]);

  return (
    <>
      {open ? (
        <Select
          value={activeOrganization?.id}
          onValueChange={async (orgId) => {
            const res = await authClient.organization.setActive({
              organizationId: orgId,
            });

            if (res?.data?.slug) {
              router.push(`/w/${res.data.slug}/projects`);
            }
          }}
        >
          <SelectTrigger className="w-full max-w-2xl">
            <SelectValue
              placeholder={
                isPending
                  ? "Loading workspaces..."
                  : activeOrganization?.name || "Select a workspace"
              }
            />
          </SelectTrigger>

          <SelectContent position="popper">
            <SelectGroup>
              {workspaces?.map((workspace) => (
                <SelectItem key={workspace.id} value={workspace.id}>
                  <div className="flex items-center gap-2">
                    <Building size={16} />
                    {workspace.name}
                  </div>
                </SelectItem>
              ))}

              <CreateWorkspaceDialog />
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : null}
    </>
  );
}

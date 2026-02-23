"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import CreateOrgDialog from "../modals/create-org-dialog";

export default function OrgSwitcher() {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const router = useRouter();

  const { data: organizations } = authClient.useListOrganizations();
  const [value, setValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (activeOrganization) {
      setValue(activeOrganization.id);
    }
  }, [activeOrganization]);

  const handleValueChange = async (organizationId: string) => {
    const org = organizations?.find((o) => o.id === organizationId);

    try {
      const { data, error } = await authClient.organization.setActive({
        organizationId,
      });
      router.push(`/w/${org?.slug}`);

      if (data) {
        toast.success(`Switched to ${org?.name} workspace`);
      } else {
        toast.error(error.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full max-w-2xl">
          <SelectValue placeholder="Select workspace" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            <SelectLabel>Switch workspace</SelectLabel>
            {organizations &&
              organizations.map((org, idx) => (
                <SelectItem key={idx} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
          </SelectGroup>
          <SelectSeparator/>
          
          <SelectGroup>
           <CreateOrgDialog/>
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}

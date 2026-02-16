'use client'

import { startTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { updateMemberRole } from "@/server/member";
import { toast } from "sonner";

type Props = {
  memberId: string;
  currentRole: "owner" | "admin" | "member";
};

export default function RoleSwitcher({ currentRole, memberId }: Props) {
  function handleChange(role: string) {
    startTransition(async () => {
      try {
        const roleChange = await updateMemberRole(
          memberId,
          role as Props["currentRole"],
        );
        if (!roleChange) {
          toast.error("Failed to update role");
        }
        toast.success(`is changed to ${roleChange.data?.role}`);
      } catch {
        toast.error("Something went wrong")
      }
    });
  }

  return (
    <Select defaultValue={currentRole} disabled={currentRole === "owner"} onValueChange={() => handleChange(currentRole)}>
      <SelectTrigger className="w-full max-w-37.5">
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectItem value="owner">Owner</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="member">Member</SelectItem>
      </SelectContent>
    </Select>
  );
}

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import RoleSwitcher from "../role-switcher";

type Members = {
  id: string;
  image: string;
  name: string;
  email: string;
  role: "admin" | "owner" | "member";
};

export default function MemberTable({
  members,
}: {
  members: Members[];
}) {
  return (
    <Table className="border rounded-lg overflow-hidden">
      <TableCaption className="py-4 text-muted-foreground">
        A list of all members in this organization
      </TableCaption>

      {/* HEADER */}
      <TableHeader>
        <TableRow className="h-14">
          <TableHead className="w-25 text-center">
            Avatar
          </TableHead>

          <TableHead className="w-50">
            Name
          </TableHead>

          <TableHead className="min-w-65 max-w-35">
            Email
          </TableHead>

          <TableHead className="w-40 text-right">
            Role
          </TableHead>

          <TableHead className="w-25 text-center">
            Action
          </TableHead>
        </TableRow>
      </TableHeader>

      {/* BODY */}
      <TableBody>
        {members.map((item) => (
          <TableRow
            key={item.id}
            className="h-16"
          >
            {/* Avatar */}
            <TableCell className="text-center">
              <Image src={"/person-placeholder.png"} height={30} width={30} alt="member avatar"/>
            </TableCell>

            {/* Name */}
            <TableCell className="font-medium">
              {item.name}
            </TableCell>

            {/* Email */}
            <TableCell className="text-muted-foreground">
              {item.email}
            </TableCell>

            {/* Role */}
            <TableCell className="text-right">
              <RoleSwitcher
                currentRole={item.role}
                memberId={item.id}
              />
            </TableCell>

            {/* Action */}
            <TableCell className="text-center">
              <Button
                variant="destructive"
                size="icon"
                disabled={item.role === "owner"}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

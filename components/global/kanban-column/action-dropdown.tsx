import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteColumn } from "@/server/column";
import { Edit, EllipsisVertical, Trash } from "lucide-react";
import { toast } from "sonner";

type Props = {
  columnId: string;
};

export default function ActionDropdown({ columnId }: Props) {
  const handleDelete = async (id: string) => {
    const deleteCol = await deleteColumn(id);
    if (deleteCol.status === 200) {
      toast.success("Success");
    } else {
      toast.error("Failed");
    }
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button size={"icon"} variant={"ghost"}>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => handleDelete(columnId)}
              variant="destructive"
            >
              <Trash /> Delete Column
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

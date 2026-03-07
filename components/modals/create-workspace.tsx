import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import CreateWorkspaceForm from "../forms/create-workspace";
import { useState } from "react";

export default function CreateWorkspaceDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full justify-start" variant={"ghost"}>
            <Plus className="h-2 w-2" /> Create workspace
          </Button>
        </DialogTrigger>

        <DialogContent className="w-104">
          <DialogTitle className="text-xl">Create new workspace</DialogTitle>
          <CreateWorkspaceForm
            onCreated={() => {
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

import { Grid2X2Plus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import CreateOrgForm from "../forms/create-organization";
import { useState } from "react";

export default function CreateOrgDialog() {
  const [open , setOpen] = useState(false)
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
           <Button className="w-full">
              <Plus className="h-2 w-2"/> Create workspace
            </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogTitle className="text-xl">Create new workspace</DialogTitle>
          <CreateOrgForm/>
        </DialogContent>
      </Dialog>
    </>
  );
}

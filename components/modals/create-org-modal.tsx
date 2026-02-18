import { Grid2X2Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

export default function CreateOrgDialog() {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Grid2X2Plus className="w-4 h-4" />
            Create new Workspace
          </Button>
        </DialogTrigger>

        <DialogContent></DialogContent>
      </Dialog>
    </>
  );
}

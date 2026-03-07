import CreateWorkspaceForm from "@/components/forms/create-workspace";
import { Card } from "@/components/ui/card";

export default function Page() {
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md p-4">
            <CreateWorkspaceForm/>
        </Card>
      </div>
    </>
  );
}

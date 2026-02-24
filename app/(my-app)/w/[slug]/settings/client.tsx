"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Image from "next/image";
import { deleteOraganization } from "@/server/organization";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  name: string;
  slug: string;
  description: string;
  orgId: string;
};

export function WorkspaceSettingsForm({
  name,
  slug,
  description,
  orgId,
}: Props) {
  const router = useRouter()
  const handleOrgDelete = async (orgId: string) => {
    const res = await deleteOraganization(orgId);
    if(!res.success){
      toast.error("Error deleting workpsace")
    }

    toast.success("Workpsace Deleted")
    router.push('/w')
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">General</CardTitle>
          <p className="text-sm text-muted-foreground">
            General settings for your workspace.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <Label>Workspace Name</Label>
              <Input defaultValue={name} />
              <p className="text-xs text-muted-foreground">
                Changing your workspace name will update it for all members.
              </p>
            </div>

            <div className="space-y-4">
              <Label>Workspace Slug (URL)</Label>

              <div className="flex gap-4">
                <span className="flex items-center px-3 text-sm border border-r-0 rounded-l-md bg-muted text-muted-foreground">
                  example.com/w/
                </span>
                <Input className="rounded-l-none" defaultValue={slug} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea rows={4} defaultValue={description} />
          </div>

          <div className="flex items-center justify-between">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
          <p className="text-sm text-muted-foreground">
            Customize how your workspace looks.
          </p>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-4">
            {/* Logo Preview */}
            <div className="h-16 w-16 rounded-md bg-muted border">
              {/* Replace with next/image */}
              <Image
                src={"/person-placeholder.png"}
                width={32}
                height={32}
                alt="organization logo"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Workspace Logo</p>
              <p className="text-xs text-muted-foreground">
                Recommended image at least 400x400.
              </p>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-base text-destructive">
            Danger Zone
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <p className="font-medium">Delete this workspace</p>
            <p className="text-sm text-muted-foreground">
              Delete the application and all associated instances and data. This
              action is irreversible.
            </p>
          </div>

          <Button variant="destructive" onClick={ () => handleOrgDelete(orgId)}>
            Delete Workspace
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

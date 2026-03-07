"use client";

import AlertDialogBox from "@/components/modals/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { updateWorkspaceImage } from "@/server/user";
import { removeWorkspaceImage } from "@/server/workspace";
import { Loader2, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
  workspaceName: string;
  slug: string;
  workspaceId: string;
  imageUrl: string;
}

export default function SettingsClient({
  workspaceName,
  slug,
  imageUrl,
  workspaceId,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(workspaceName);
  const [inputSlug, setInputSlug] = useState(slug);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(imageUrl ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await updateWorkspaceImage(formData);

      if (result.error) throw new Error(result.error);

      setPreview(result.url!);
      toast.success("Avatar updated!");
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
      setPreview(imageUrl ?? null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleEditClick() {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus());
  }

  function handleCancel() {
    setName(workspaceName);
    setIsEditing(false);
  }

  async function handleSave() {
    if (name === workspaceName) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    const result = await authClient.organization.update({
      organizationId: workspaceId,
      data: {
        name,
        slug: inputSlug,
      },
    });
    setIsLoading(false);

    if (result.error) {
      toast.error(result.error.message || "An error occurred");
    } else {
      toast.success("Workspace updated!");
      setIsEditing(false);
    }
  }

  async function handleRemove() {
    setIsRemoving(true);
    const result = await removeWorkspaceImage();
    if (result.error) {
      toast.error(result.error);
    } else {
      setPreview(null);
      toast.success("Avatar removed");
    }
    setIsRemoving(false);
  }

  async function handleDeleteWorkspace() {
    try {
      await authClient.organization.delete({
        organizationId: workspaceId,
      });
      router.push("/w/redirecting");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">General</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              General settings for your workspace.
            </CardDescription>
            <CardAction>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={handleEditClick}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <X className="w-4 h-4 " />
                  Cancel
                </Button>
              )}
            </CardAction>
          </CardHeader>

          <CardContent className="space-y-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex items-center justify-start gap-6">
              <div>
                <Avatar className="w-18 h-18">
                  <AvatarImage src={preview ?? undefined} />
                  <AvatarFallback className="text-4xl font-semibold">
                    <h1 className="font-bold text-4xl">W</h1>
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <div className="space-x-2 flex items-center">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "+ Change Image"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRemove}
                    disabled={isRemoving || (!preview && !imageUrl)}
                  >
                    {isRemoving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Remove Image"
                    )}
                  </Button>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">
                    We support PNG, JPEG's and JPG under 2 MB
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  ref={inputRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  placeholder={name}
                  className={
                    !isEditing
                      ? "bg-muted cursor-default disabled:text-black-900"
                      : ""
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">slug</Label>
                <Input
                  id="slug"
                  disabled={!isEditing}
                  value={inputSlug}
                  onChange={(e) => setInputSlug(e.target.value)}
                  className={
                    !isEditing
                      ? "bg-muted cursor-default disabled:text-black-900"
                      : ""
                  }
                ></Input>
              </div>
            </div>

            {isEditing && (
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-400">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle>Delete Workspace</CardTitle>
                <CardDescription>
                  Deleting this workspace will remove all associated data.
                </CardDescription>
              </div>
              <div>
                <AlertDialogBox
                  btnText="Delete workspace"
                  title="Are you sure to delete workspace"
                  description="Deleting this workspace will also delete all the associated data"
                  handleDelete={handleDeleteWorkspace}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

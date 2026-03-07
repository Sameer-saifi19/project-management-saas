"use client";

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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { authClient } from "@/lib/auth-client";
import { removeUserImage, updateUserImage } from "@/server/user";
import { Loader2, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";


interface Props {
  imageUrl: string | undefined;
  initialName: string;
  email: string;
}

export default function ProfileClient({ imageUrl, initialName, email }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
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

      const result = await updateUserImage(formData);

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
    setName(initialName);
    setIsEditing(false);
  }

  async function handleSave() {
    if (name === initialName) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    const result = await authClient.updateUser({
      name: name,
    });
    setIsLoading(false);

    if (result.error) {
      toast.error(result.error.message || "An error occurred");
    } else {
      toast.success("Profile updated!");
      setIsEditing(false);
    }
  }

  const initials = initialName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function handleRemove() {
    setIsRemoving(true);
    const result = await removeUserImage();
    if (result.error) {
      toast.error(result.error);
    } else {
      setPreview(null);
      toast.success("Avatar removed");
    }
    setIsRemoving(false);
  }

  async function handleDeleteUser() {
    try {
      authClient.deleteUser();
      router.push("/");
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
              General settings for user.
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
          <Separator />
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
                    {initials}
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  disabled
                  className="bg-muted cursor-default"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
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
            <CardTitle>Account Security</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="flex justify-between items-center">
              <Input
                type="password"
                disabled
                placeholder="**************"
                className="w-1/2 bg-muted"
              />
              <Button variant={"outline"}>Change Password</Button>
            </div>

            <div className="flex justify-between">
              <div className="space-y-2">
                <h4 className="text-md leading-none font-semibold">
                  2-step verification
                </h4>
                <p className="text-xs text-muted-foreground">
                  Add an additional security to your account
                </p>
              </div>
              <div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle>Delete my account</CardTitle>
                <CardDescription>
                  Permanently delete the account and remove access from all
                  workspaces.
                </CardDescription>
              </div>
              <div>
                <Button variant={"destructive"} onClick={handleDeleteUser}>
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

"use client";

import { UserPlus2, Link as LinkIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { sendOrganizationInvitation } from "@/server/emails";

type FormValues = {
  email: string;
};

export default function AddNewMemberInvite() {
  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    const res = await sendOrganizationInvitation({ email: data.email });
    if (res.status === 200) {
      toast.success("Invitation sent");
    } else {
      toast.error(res.message);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Invite link copied");
  };

  return (
    <Dialog>
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button>
          <UserPlus2 className="w-4 h-4 mr-2" />
          Invite Workspace Members
        </Button>
      </DialogTrigger>

      {/* Content */}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Invite to Workspace</DialogTitle>
        </DialogHeader>

        {/* FORM START */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter email address to invite"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* FOOTER INSIDE FORM */}
            <DialogFooter className="sm:justify-between">
              <Button type="submit">Invite to Workspace</Button>

              <Button type="button" variant="outline" onClick={copyLink}>
                <LinkIcon className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </DialogFooter>
          </form>
        </Form>
        {/* FORM END */}
      </DialogContent>
    </Dialog>
  );
}

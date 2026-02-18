"use client";

import { PlusIcon, X } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { createColumnSchema, createColumnSchemaType } from "@/schema/column";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useParams } from "next/navigation";
import { createColumns } from "@/server/column";
import { toast } from "sonner";

export default function ColumnPopover() {
  const params = useParams();
  const slug = params.slug as string;

  const [open, setOpen] = useState(false);

  const form = useForm<createColumnSchemaType>({
    resolver: zodResolver(createColumnSchema),
    defaultValues: {
      name: "",
    },
  });

  const createColumn = async (value: createColumnSchemaType) => {
    const data = await createColumns({ name: value.name, projectId: slug });
    if(!data){
      toast.error("error")
    }
    form.reset()
    setOpen(false)
  };
  
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="w-full">
          <Button className="w-full">
            <PlusIcon /> Add Column
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="p-2">
          <div className="grid gap-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(createColumn)}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter column name" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Add column
                </Button>
              </form>
            </Form>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

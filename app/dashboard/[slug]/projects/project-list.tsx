"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { deleteProject } from "@/server/project";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { EditProjectModal } from "@/components/modals/edit-modal";

type Projects = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

export default function ProjectList({
  projects,
}: {
  projects: Projects[];
}) {
  const [selected, setSelected] =
    useState<Projects | null>(null);

  if (!projects?.length) {
    return (
      <div className="text-muted-foreground">
        No projects found.
      </div>
    );
  }

  const handleDelete = async (
    projectId: string
  ) => {
    const result =
      await deleteProject(projectId);

    if (result.status !== 200) {
      toast.error("Error updating project");
      return;
    }

    toast.success(
      "Project updated successfully"
    );
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="hover:shadow-md transition"
          >
            <CardHeader>
              <h3 className="font-semibold text-lg">
                {project.name}
              </h3>

              <p className="text-sm text-muted-foreground">
                {project.slug}
              </p>

              <CardAction>
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      handleDelete(
                        project.id
                      )
                    }
                    variant="destructive"
                    size="icon"
                  >
                    <Trash />
                  </Button>

                  <Button
                    onClick={() =>
                      setSelected(
                        project
                      )
                    }
                    size="icon"
                  >
                    <Edit />
                  </Button>
                </div>
              </CardAction>
            </CardHeader>

            <CardContent>
              <p className="text-sm">
                {project.description ||
                  "No description"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selected && (
        <EditProjectModal
          open={!!selected}
          setOpen={(v: any) =>
            !v && setSelected(null)
          }
          project={selected}
        />
      )}
    </>
  );
}

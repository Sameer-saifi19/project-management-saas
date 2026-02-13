"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { deleteProject } from "@/server/project";
import { Trash } from "lucide-react";
import { toast } from "sonner";

type Projects = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

export default function ProjectList({ projects }: { projects: Projects[] }) {
  if (!projects?.length) {
    return <div className="text-muted-foreground">No projects found.</div>;
  }

  const handleDelete = async (projectId: string) => {
    const result = await deleteProject(projectId)
    if(!result){
        toast.error("Error deleting project")
    }
    toast.success("project deleted successfully")
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition">
            <CardHeader>
              <h3 className="font-semibold text-lg">{project.name}</h3>
              <p className="text-sm text-muted-foreground">{project.slug}</p>
              <CardAction>
                <Button
                  onClick={() => handleDelete(project.id)}
                  variant={"destructive"}
                  size={"icon"}
                >
                  <Trash />
                </Button>
              </CardAction>
            </CardHeader>

            <CardContent>
              <p className="text-sm">
                {project.description || "No description"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { deleteProject } from "@/server/project";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { CreateProjectSheet } from "@/components/modals/create-project";
import { formatDateTime } from "@/utils/date-formatter";
import Link from "next/link";

type Projects = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: Date;
};

export default function ProjectList({ projects }: { projects: Projects[] }) {
  const pathName = usePathname();

  const handleDelete = async (projectId: string) => {
    const result = await deleteProject(projectId);

    if (result.status !== 200) {
      toast.error("Error deleting project");
      return;
    }

    toast.success("Project deleted successfully");
  };

  return (
    <>
      <div className="flex flex-col gap-12">
        {/* upper part  */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            All Projects
          </h1>
          <CreateProjectSheet />
        </div>

        {/* main part  */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {!projects.length ? <h1>No projects found</h1> : null}
          {projects.map((project) => (
            <Link href={`/p/${project.slug}`} key={project.id}>
              <Card  className="hover:shadow-md dark:hover:bg-muted transition">
                <CardHeader>
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  <CardAction>
                    <div className="flex gap-2">
                      <Button
                      asChild
                        onClick={() => handleDelete(project.id)}
                        variant="destructive"
                        size="icon"
                      >
                        <Trash />
                      </Button>
                    </div>
                  </CardAction>
                </CardHeader>

                <CardContent>
                  <p className="text-md text-muted-foreground">
                    {project.description || "No description"}
                  </p>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground">{`Created on ${formatDateTime(project.createdAt)}`}</p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

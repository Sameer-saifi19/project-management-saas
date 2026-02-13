import { auth } from "@/lib/auth";
import { getAllProjects } from "@/server/project";
import { headers } from "next/headers";
import ProjectList from "./project-list";

export default async function Page() {

  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  const projects = await getAllProjects(session?.session.activeOrganizationId as string)
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="max-w-4xl w-full">
            <ProjectList projects={projects.data ?? []}/>
        </div>
      </div>
    </>
  );
}

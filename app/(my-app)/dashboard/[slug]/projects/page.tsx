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
      <div className="flex items-center justify-center w-full">
        <div className="w-full">
            <ProjectList projects={projects.data ?? []}/>
        </div>
      </div>
    </>
  );
}

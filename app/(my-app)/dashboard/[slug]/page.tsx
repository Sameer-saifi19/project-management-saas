import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { getAllProjects } from "@/server/project";
import { headers } from "next/headers";
import Link from "next/link";
import ProjectList from "./client";

type Props = {
  params: { slug: string };
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const projects = await getAllProjects(
    session?.session.activeOrganizationId as string,
    slug
  );

  return (
    <>
      <div className="flex items-center justify-center w-full">
        <div className="w-full">
          <ProjectList projects={projects.data ?? []} />
        </div>
      </div>
    </>
  );
}

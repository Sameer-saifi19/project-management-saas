import ProjectNavbar from "@/components/global/project-navbar/project-navbar";
import KanbanBoard from "./client";

type Props = {
  params: { slug: string };
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return (
    <>
        <KanbanBoard/>
    </>
  );
}

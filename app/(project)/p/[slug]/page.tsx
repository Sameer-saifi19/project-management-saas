import { getAllColumns } from "@/server/column";
import KanbanBoard from "./client";

type Props = {
  params: { slug: string };
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const res = await getAllColumns(slug);
  const raw = res.data;

  const columns =
    raw?.map((c) => ({
      id: c.id,
      name: c.name,
      tasks: (c.tasks ?? []).map((t) => ({ id: t.id, title: t.title , completed: t.completed})),
    })) ?? [];
  return (
    <>
      <KanbanBoard key={slug} columns={columns} />
    </>
  );
}

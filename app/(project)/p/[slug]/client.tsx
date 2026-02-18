'use client'

import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Plus } from "lucide-react";
import ColumnPopover from "@/components/modals/create-column-popover";
import { useQuery } from "@tanstack/react-query";
import { getAllColumns } from "@/server/column";
import { useParams } from "next/navigation";



function KanbanColumn({
  title,
  tasks,
}: {
  title: string;
  tasks: { id: number; title: string }[];
}) {
  const params = useParams()
  const id = params.id as string

  const query = useQuery({
    queryKey: ["getColumns"],
    queryFn: () => getAllColumns(id)
  })

  return (
    <div
      className="flex flex-col gap-2 h-full"
      style={{ width: "280px", minWidth: "280px" }}
    >
      {/* Column Card */}
      <Card className="w-full">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground flex items-center justify-between">
            {title}
            <CardAction>
              <EllipsisVertical/>
            </CardAction>
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 pb-4 flex flex-col gap-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-xl border bg-background p-4 text-sm shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              {task.title}
            </div>
          ))}

          <div className="mt-2">
            <Button className="w-fit">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type Columns = {
  id: string,
  name: string,
  tasks: []
}


export default function KanbanBoard({columns}: {columns: Columns[]}) {
  

  return (
    /* Outer scroll container — horizontal scroll when columns overflow */
    <div className="w-full overflow-x-auto overflow-y-hidden px-2 h-full">
      <div
        className="flex flex-row gap-4 items-start h-full px-2"
        style={{ width: "max-content", minWidth: "100%" }}
      >
        {columns.map((col) => (
          <KanbanColumn key={col.id} title={col.name} tasks={col.tasks} />
        ))}

        {/* Add Column Button — same fixed width as a column card */}
        <div style={{ width: "280px", minWidth: "280px" }}>
          <ColumnPopover />
        </div>
      </div>
    </div>
  );
}


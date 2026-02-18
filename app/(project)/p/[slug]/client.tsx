import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Plus } from "lucide-react";
import ColumnPopover from "@/components/modals/create-column-popover";

const columns = [
  {
    title: "To Do",
    tasks: [
      { id: 1, title: "Research competitors" },
      { id: 2, title: "Write project brief" },
    ],
  },
  {
    title: "In Progress",
    tasks: [
      { id: 3, title: "Design wireframes" },
      { id: 4, title: "Set up database schema" },
      { id: 5, title: "Build auth flow" },
    ],
  },
  {
    title: "In Review",
    tasks: [{ id: 6, title: "API integration" }],
  },
  {
    title: "Done",
    tasks: [
    ],
  },
];

function KanbanColumn({
  title,
  tasks,
}: {
  title: string;
  tasks: { id: number; title: string }[];
}) {
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

export default function KanbanBoard() {
  return (
    /* Outer scroll container — horizontal scroll when columns overflow */
    <div className="w-full overflow-x-auto overflow-y-hidden px-2 h-full">
      <div
        className="flex flex-row gap-4 items-start h-full px-2"
        style={{ width: "max-content", minWidth: "100%" }}
      >
        {columns.map((col) => (
          <KanbanColumn key={col.title} title={col.title} tasks={col.tasks} />
        ))}

        {/* Add Column Button — same fixed width as a column card */}
        <div style={{ width: "280px", minWidth: "280px" }}>
          <ColumnPopover />
        </div>
      </div>
    </div>
  );
}

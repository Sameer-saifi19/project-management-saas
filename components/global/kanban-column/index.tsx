import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ActionDropdown from "./action-dropdown";

export default function KanbanColumn({
  id,
  title,
  tasks,
}: {
  id: string;
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
              <ActionDropdown columnId={id} />
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

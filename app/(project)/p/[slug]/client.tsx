"use client";

import KanbanColumn from "@/components/global/kanban-column";
import ColumnPopover from "@/components/modals/create-column-popover";

type Task = { id: string; title: string };

type Columns = {
  id: string;
  name: string;
  tasks: Task[];
};

export default function KanbanBoard({ columns }: { columns: Columns[] }) {
  return (
    <div className="w-full overflow-x-auto overflow-y-hidden px-2 h-full">
      <div
        className="flex flex-row gap-4 items-start h-full px-2"
        style={{ width: "max-content", minWidth: "100%" }}
      >
        {columns.map((col) => (
          <KanbanColumn
            id={col.id}
            key={col.id}
            title={col.name}
            tasks={col.tasks}
          />
        ))}

        <div style={{ width: "280px", minWidth: "280px" }}>
          <ColumnPopover />
        </div>
      </div>
    </div>
  );
}

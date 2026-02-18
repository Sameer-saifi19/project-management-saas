"use client";

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
import { useState, useRef, useEffect, use } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { updateColumnTitle } from "@/server/column";
import { createTask } from "@/server/tasks";

export default function KanbanColumn({
  id,
  title,
  tasks,
}: {
  id: string;
  title: string;
  tasks: { id: number; title: string }[];
}) {
  // column
  const [isEditing, setIsEditing] = useState(false);
  const [titleEdit, setTitleEdit] = useState(title);

  // task
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const taskInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (isAddingTask) {
      taskInputRef.current?.focus();
    }
  }, [isAddingTask]);

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;

    await createTask(id, newTaskTitle);

    setNewTaskTitle("");
    setIsAddingTask(false);
  };

  const handleCancelTask = () => {
    setNewTaskTitle("");
    setIsAddingTask(false);
  };

  // SAVE title
  const handleSave = async () => {
    if (!titleEdit.trim()) {
      setTitleEdit(title);
      setIsEditing(false);
      return;
    }

    if (titleEdit !== title) {
      await updateColumnTitle(id, titleEdit);
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitleEdit(title);
    setIsEditing(false);
    toast.error("Edit cancelled");
  };

  return (
    <div
      className="flex flex-col gap-2 h-full"
      style={{ width: "280px", minWidth: "280px" }}
    >
      <Card className="w-full">
        <CardHeader className="pb-3 pt-4 px-4">
          <div className="flex items-center justify-between gap-2">
            {/* TITLE */}
            {isEditing ? (
              <Input
                ref={inputRef}
                value={titleEdit}
                onChange={(e) => setTitleEdit(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") handleCancel();
                }}
                className="border px-2 py-1 rounded-2xl w-full text-sm font-semibold uppercase"
              />
            ) : (
              <CardTitle
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="text-sm font-semibold cursor-pointer tracking-wide uppercase"
                title="Double click to edit"
              >
                {titleEdit}
              </CardTitle>
            )}

            {/* ACTIONS */}
            <CardAction>
              <ActionDropdown columnId={id} />
            </CardAction>
          </div>
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
            {isAddingTask ? (
              <div className="flex flex-col gap-2">
                <Input
                  ref={taskInputRef}
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateTask();
                    if (e.key === "Escape") handleCancelTask();
                  }}
                  placeholder="Enter task title..."
                />

                <div className="flex gap-2">
                  <Button size="sm" onClick={handleCreateTask}>
                    Save
                  </Button>

                  <Button size="sm" variant="ghost" onClick={handleCancelTask}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                className="w-full flex justify-start"
                variant="ghost"
                onClick={() => setIsAddingTask(true)}
              >
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

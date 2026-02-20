"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash } from "lucide-react";
import ActionDropdown from "./action-dropdown";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { updateColumnTitle } from "@/server/column";
import { createTask, updateTaskComplete } from "@/server/tasks";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";

export default function KanbanColumn({
  id,
  title,
  tasks,
}: {
  id: string;
  title: string;
  tasks: { id: string; title: string; completed: boolean }[];
}) {
  // column
  const [isEditing, setIsEditing] = useState(false);
  const [titleEdit, setTitleEdit] = useState(title);

  const [showDelete, setShowDelete] = useState(false);
  // task
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Optimistic state for tasks – keep stable order when props update (e.g. after complete toggle)
  const [localTasks, setLocalTasks] = useState(tasks);

  // When server data arrives, update task fields but preserve current display order (no reorder)
  useEffect(() => {
    setLocalTasks((prev) => {
      const prevIds = prev.map((t) => t.id);
      const taskMap = new Map(tasks.map((t) => [t.id, t]));
      const ordered = prevIds
        .map((id) => taskMap.get(id))
        .filter(
          (t): t is { id: string; title: string; completed: boolean } =>
            t != null,
        );
      const newTaskIds = tasks.filter((t) => !prevIds.includes(t.id));
      return [...ordered, ...newTaskIds];
    });
  }, [tasks]);

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
      className="flex flex-col gap-2 h-160"
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
                className="border px-2 py-1  w-full text-sm font-semibold uppercase"
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

        <CardContent className="flex overflow-y-auto flex-col pl-2 pr-0">
          <ScrollArea className="h-full pr-4 scros">
            <div className="flex flex-col gap-1">
              {localTasks.map((task) => (
                <FieldGroup
                  key={task.id}
                  className="rounded-xl border bg-background px-4 py-3 text-sm shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <Field orientation={"horizontal"}>
                    <Checkbox
                      className="rounded-full cursor-pointer"
                      checked={task.completed}
                      onCheckedChange={async (checked) => {
                        // Handle indeterminate state - treat as false
                        const newCompleted = checked === true;
                        // Optimistic update
                        setLocalTasks((prevTasks) =>
                          prevTasks.map((t) =>
                            t.id === task.id
                              ? { ...t, completed: newCompleted }
                              : t,
                          ),
                        );
                        setShowDelete(true)
                        try {
                          const result = await updateTaskComplete(
                            task.id,
                            newCompleted,
                          );
                          if (!result.success) {
                            // Revert on error
                            setLocalTasks((prevTasks) =>
                              prevTasks.map((t) =>
                                t.id === task.id
                                  ? { ...t, completed: !newCompleted }
                                  : t,
                              ),
                            );
                            toast.error(
                              result.message || "Failed to update task",
                            );
                          }
                        } catch (error) {
                          // Revert on error
                          setLocalTasks((prevTasks) =>
                            prevTasks.map((t) =>
                              t.id === task.id
                                ? { ...t, completed: !newCompleted }
                                : t,
                            ),
                          );
                          const errorMessage =
                            error instanceof Error
                              ? error.message
                              : "Failed to update task";
                          toast.error(errorMessage);
                          console.error("Task update error:", error);
                        }
                      }}
                    />

                    <FieldLabel
                      className={
                        task.completed === true
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      }
                    >
                      {task.title}
                    </FieldLabel>

                    {showDelete ? (
                      <Button variant={"ghost"} size={"icon-sm"} className="text-muted-foreground">
                        <Trash />
                      </Button>
                    ) : null}
                    <Button
                      onClick={handleCreateTask}
                      variant={"ghost"}
                      size={"icon-sm"}
                    >
                      <Edit className="text-muted-foreground" />
                    </Button>
                  </Field>
                </FieldGroup>
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

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCancelTask}
                      >
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
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

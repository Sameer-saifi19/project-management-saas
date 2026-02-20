"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const createTask = async (columnId: string, title: string) => {
  try {
    const create = await prisma.task.create({
      data: {
        order: 1,
        title: title,
        columnId: columnId,
      },
    });

    if (!create) {
      return { status: 500, success: false };
    }

    revalidatePath("/project/p", "layout");

    return { status: 201, success: true };
  } catch (error) {
    console.error("Error creating task", error);
    throw new Error("Error creating task");
  }
};

export async function updateTaskComplete(taskId: string, completed: boolean) {
  if (!taskId) {
    return {
      success: false,
      status: 400,
      message: "Task ID is required",
    };
  }

  try {
    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { completed },
    });

    if (!updated) {
      return {
        success: false,
        status: 404,
        message: "Task not found",
      };
    }

    revalidatePath("/project/p", "layout");
    return {
      success: true,
      status: 200,
      message: "Task updated successfully",
    };
  } catch (error) {
    console.error("Failed to update task:", error);
    const errorMessage = error instanceof Error ? error.message : "Task update failed";
    return {
      success: false,
      status: 500,
      message: errorMessage,
    };
  }
}

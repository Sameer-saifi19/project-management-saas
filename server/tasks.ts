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

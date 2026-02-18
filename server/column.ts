"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
interface Props {
  name: string;
  projectId: string;
}

export const createColumns = async ({ name, projectId }: Props) => {
  try {
    const createColumn = await prisma.column.create({
      data: {
        name,
        order: 1,
        projectId,
      },
    });

    if (!createColumn) {
      return {
        status: 500,
        success: false,
        message: "Error creating column",
        data: null,
      };
    }

    revalidatePath("/project/p", "layout");

    return {
      status: 201,
      success: true,
      message: "Column created",
      data: createColumn,
    };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Internal server error" };
  }
};

export const getAllColumns = async (projectId: string) => {
  try {
    const getAllColumn = await prisma.column.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        tasks: true,
      },
    });

    if (!getAllColumn) {
      return {
        status: 500,
        success: false,
        message: "Error creating column",
        data: null,
      };
    }

    return {
      status: 200,
      success: true,
      message: "column fetched",
      data: getAllColumn,
    };
  } catch (error) {
    return { status: 500, message: "Internal server error" };
  }
};

export const deleteColumn = async (columnId: string) => {
  if (!columnId) {
    throw new Error("ColumnId is required");
  }

  try {
    const deleteCol = await prisma.column.delete({
      where: {
        id: columnId,
      },
    });

    if (!deleteCol) {
      return { status: 500, success: false };
    }

    revalidatePath("/project/p", "layout");
    return { success: true, status: 200 };
  } catch (error) {
    console.error("Error deleting column", error);
    throw new Error("Failed to delete column");
  }
};

export const updateColumnTitle = async (columnId: string, name: string) => {
  if (!columnId) {
    throw new Error("Column ID is required");
  }

  if (!name.trim()) {
    throw new Error("Column name cannot be empty");
  }

  try {
    const column = await prisma.column.update({
      where: {
        id: columnId,
      },
      data: {
        name: name,
      },
    });

    if(!column){
      return {status: 500, success: false}
    }

    revalidatePath("/project/p", "layout");

    return {
      status: 200,
      success: true,
      data: column,
    };
  } catch (error) {
    console.error("[UPDATE_COLUMN_TITLE]", error);
    throw new Error("Failed to update column title");
  }
};

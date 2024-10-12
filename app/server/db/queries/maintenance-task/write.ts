import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import {
  MaintenanceTaskInsert,
  MaintenanceTaskUpdate,
  tableMaintenanceTask,
} from "@/server/db/schema";

export async function addMaintenanceTask(data: {
  task: MaintenanceTaskInsert;
  stalls: string[];
}): Promise<MaintenanceTaskInsert> {
  const { task, stalls } = data;

  // Start a transaction
  const result = await db.transaction(async (trx) => {
    // Insert the maintenance task
    const [insertedTask] = await trx
      .insert(tableMaintenanceTask)
      .values({
        ...task,
        scheduledDate: new Date(task.scheduledDate).getTime(), // Convert to timestamp
      })
      .returning();

    // Here you can handle the stalls if needed
    // For example, inserting into a stall maintenance task relation table

    return insertedTask;
  });

  return result;
}

interface CompleteMaintenanceTaskInput {
  taskId: string;
  completionDate: number; // Assuming this is a timestamp
  completionTime: number; // Assuming this is in hours
}

export async function completeMaintenanceTask(
  input: CompleteMaintenanceTaskInput
) {
  const { taskId, completionDate, completionTime } = input;

  // Update the maintenance task to mark it as complete
  const updatedTasks = await db
    .update(tableMaintenanceTask)
    .set({
      status: "completed",
      completionDate: completionDate,
      completionTime: completionTime,
    })
    .where(eq(tableMaintenanceTask.maintenanceTaskId, taskId))
    .returning();

  // Return the updated task
  return updatedTasks[0];
}

export async function deleteMaintenanceTask(taskId: string) {
  try {
    const results = await db
      .delete(tableMaintenanceTask)
      .where(eq(tableMaintenanceTask.maintenanceTaskId, taskId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete maintenance task: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while deleting maintenance task");
    }
  }
}

export async function updateMaintenanceTask({
  taskId,
  task,
}: {
  taskId: string;
  task: MaintenanceTaskUpdate;
}) {
  try {
    const [updatedTask] = await db
      .update(tableMaintenanceTask)
      .set(task)
      .where(eq(tableMaintenanceTask.maintenanceTaskId, taskId))
      .returning();

    return updatedTask;
  } catch (error) {
    console.error("Error updating maintenance task:", error);
    throw new Error("Failed to update maintenance task");
  }
}

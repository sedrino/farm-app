import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import {
  MaintenanceRequestInsert,
  MaintenanceRequestUpdate,
  tableMaintenanceRequest,
} from "@/server/db/schema";

export async function addMaintenanceRequest(data: MaintenanceRequestInsert) {
  try {
    // Insert the maintenance request data into the table
    const [newRequest] = await db
      .insert(tableMaintenanceRequest)
      .values(data)
      .returning();

    // Return the newly created maintenance request
    return newRequest;
  } catch (error) {
    console.error("Error adding maintenance request:", error);
    throw new Error("Failed to add maintenance request");
  }
}

export async function deleteMaintenanceRequest(requestId: string) {
  try {
    const results = await db
      .delete(tableMaintenanceRequest)
      .where(eq(tableMaintenanceRequest.maintenanceRequestId, requestId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete maintenance request: ${error.message}`);
    } else {
      throw new Error(
        "Unknown error occurred while deleting maintenance request"
      );
    }
  }
}

export async function updateMaintenanceRequest({
  requestId,
  updates,
}: {
  requestId: string;
  updates: MaintenanceRequestUpdate;
}): Promise<MaintenanceRequestUpdate | null> {
  try {
    const [updatedRequest] = await db
      .update(tableMaintenanceRequest)
      .set(updates)
      .where(eq(tableMaintenanceRequest.maintenanceRequestId, requestId))
      .returning();

    return updatedRequest || null;
  } catch (error) {
    console.error("Error updating maintenance request:", error);
    throw new Error("Failed to update maintenance request");
  }
}

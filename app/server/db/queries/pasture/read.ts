import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import {
  tablePasture,
  tablePastureMaintenance,
  tablePastureRotation,
} from "@/server/db/schema";

export async function findPastureMaintenanceHistory(pastureId: string) {
  try {
    const maintenanceHistory = await db
      .select()
      .from(tablePastureMaintenance)
      .where(eq(tablePastureMaintenance.pastureId, pastureId));

    return maintenanceHistory;
  } catch (error) {
    console.error("Error fetching pasture maintenance history:", error);
    throw new Error("Failed to fetch maintenance history");
  }
}

export async function findPastureRotationHistory(pastureId: string) {
  try {
    const rotationHistory = await db
      .select()
      .from(tablePastureRotation)
      .where(eq(tablePastureRotation.pastureId, pastureId));

    return rotationHistory;
  } catch (error) {
    console.error("Error fetching pasture rotation history:", error);
    throw new Error("Failed to fetch pasture rotation history");
  }
}

export async function findPastures({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}): Promise<(typeof tablePasture.$inferSelect)[]> {
  const offset = (page - 1) * pageSize;

  const pastures = await db
    .select()
    .from(tablePasture)
    .limit(pageSize)
    .offset(offset);

  return pastures;
}

export async function findScheduledRotations(pastureId: string) {
  try {
    const scheduledRotations = await db
      .select()
      .from(tablePastureRotation)
      .where(eq(tablePastureRotation.pastureId, pastureId));

    return scheduledRotations;
  } catch (error) {
    console.error("Error fetching scheduled rotations:", error);
    throw new Error("Failed to fetch scheduled rotations");
  }
}

export async function getPastureDetails(pastureId: string) {
  const results = await db
    .select()
    .from(tablePasture)
    .where(eq(tablePasture.pastureId, pastureId));

  return results[0] || null; // Return the first result or null if not found
}

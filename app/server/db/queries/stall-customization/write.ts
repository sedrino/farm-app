import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import {
  StallCustomizationInsert,
  tableStallCustomization,
} from "@/server/db/schema";

export async function addStallCustomization({
  stallId,
  customizationType,
  description,
  isPermanent,
  installationDate,
}: {
  stallId: string;
  customizationType: string;
  description?: string;
  isPermanent?: boolean;
  installationDate: number;
}): Promise<StallCustomizationInsert> {
  try {
    const [newCustomization] = await db
      .insert(tableStallCustomization)
      .values({
        stallId,
        customizationType,
        description,
        isPermanent: isPermanent ?? false, // Default to false if not provided
        installationDate,
      })
      .returning();

    return newCustomization;
  } catch (error) {
    console.error("Error adding stall customization:", error);
    throw new Error("Failed to add stall customization");
  }
}

export async function deleteStallCustomization({
  stallId,
  customizationId,
}: {
  stallId: string;
  customizationId: string;
}): Promise<{ deletedId: string } | null> {
  try {
    const results = await db
      .delete(tableStallCustomization)
      .where(
        and(
          eq(tableStallCustomization.stallId, stallId),
          eq(tableStallCustomization.stallCustomizationId, customizationId)
        )
      )
      .returning();

    return results[0] || null;
  } catch (error) {
    console.error("Error deleting stall customization:", error);
    throw new Error("Failed to delete stall customization");
  }
}

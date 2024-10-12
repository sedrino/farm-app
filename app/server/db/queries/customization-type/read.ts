import { db } from "@/server/db/connection";
import { tableCustomizationType } from "@/server/db/schema";

export async function findCustomizationTypes() {
  try {
    const customizationTypes = await db.select().from(tableCustomizationType);

    return customizationTypes;
  } catch (error) {
    console.error("Error fetching customization types:", error);
    throw new Error("Failed to fetch customization types");
  }
}

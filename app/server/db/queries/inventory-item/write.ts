import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import {
  InventoryItem,
  InventoryItemInsert,
  InventoryItemUpdate,
  tableInventoryItem,
} from "@/server/db/schema";

export async function addInventoryItem(data: InventoryItemInsert) {
  try {
    // Insert the new inventory item into the table
    const [newItem] = await db
      .insert(tableInventoryItem)
      .values(data)
      .returning();

    // Return the newly created inventory item
    return newItem;
  } catch (error) {
    console.error("Error adding inventory item:", error);
    throw new Error("Failed to add inventory item");
  }
}

export async function deleteInventoryItem(itemId: string) {
  try {
    const results = await db
      .delete(tableInventoryItem)
      .where(eq(tableInventoryItem.inventoryItemId, itemId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete inventory item: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while deleting inventory item");
    }
  }
}

export async function duplicateInventoryItem(
  itemId: string
): Promise<InventoryItem | null> {
  try {
    // Fetch the existing inventory item
    const existingItems = await db
      .select()
      .from(tableInventoryItem)
      .where(eq(tableInventoryItem.inventoryItemId, itemId));

    const existingItem = existingItems[0];

    if (!existingItem) {
      throw new Error("Inventory item not found");
    }

    // Create a new inventory item with the same details as the existing one
    const newItem: InventoryItem = {
      ...existingItem,
      inventoryItemId: undefined, // Generate a new ID
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Insert the new item into the database
    await db.insert(tableInventoryItem).values(newItem);

    return newItem;
  } catch (error) {
    console.error("Error duplicating inventory item:", error);
    throw new Error("Failed to duplicate inventory item");
  }
}

export async function updateInventoryItem({
  itemId,
  item,
}: {
  itemId: string;
  item: InventoryItemUpdate;
}): Promise<InventoryItemUpdate | null> {
  try {
    const [updatedItem] = await db
      .update(tableInventoryItem)
      .set(item)
      .where(eq(tableInventoryItem.inventoryItemId, itemId))
      .returning();

    return updatedItem || null;
  } catch (error) {
    console.error("Error updating inventory item:", error);
    throw new Error("Failed to update inventory item");
  }
}

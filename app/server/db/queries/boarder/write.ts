import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { BoarderInsert, BoarderUpdate, tableBoarder } from "@/server/db/schema";

export async function addBoarder(data: BoarderInsert) {
  try {
    // Insert the new boarder into the tableBoarder
    const [newBoarder] = await db.insert(tableBoarder).values(data).returning();

    // Return the newly created boarder
    return newBoarder;
  } catch (error) {
    console.error("Error adding boarder:", error);
    throw new Error("Failed to add boarder");
  }
}

export async function deleteBoarder(boarderId: string) {
  try {
    const results = await db
      .delete(tableBoarder)
      .where(eq(tableBoarder.boarderId, boarderId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete boarder: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while deleting boarder");
    }
  }
}

export async function updateBoarder(data: {
  boarderId: string;
  boarder: BoarderUpdate;
  horses?: string[];
  documents?: string[];
}): Promise<BoarderUpdate | null> {
  const { boarderId, boarder } = data;

  try {
    const [updatedBoarder] = await db
      .update(tableBoarder)
      .set(boarder)
      .where(eq(tableBoarder.boarderId, boarderId))
      .returning();

    return updatedBoarder || null;
  } catch (error) {
    console.error("Error updating boarder:", error);
    throw new Error("Failed to update boarder");
  }
}

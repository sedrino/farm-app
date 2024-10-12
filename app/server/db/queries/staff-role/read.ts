import { db } from "@/server/db/connection";
import { tableStaffRole } from "@/server/db/schema";

export async function findStaffRoles() {
  try {
    const staffRoles = await db.select().from(tableStaffRole);
    return staffRoles;
  } catch (error) {
    console.error("Error fetching staff roles:", error);
    throw new Error("Failed to fetch staff roles");
  }
}

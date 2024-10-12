import { db } from "@/server/db/connection";
import { tableDataPoint } from "@/server/db/schema";

export async function findDataPoints() {
  try {
    const dataPoints = await db.select().from(tableDataPoint);
    return dataPoints;
  } catch (error) {
    console.error("Error fetching data points:", error);
    throw new Error("Failed to fetch data points");
  }
}

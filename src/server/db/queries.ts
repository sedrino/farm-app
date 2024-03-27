import { eq } from "drizzle-orm";
import { db } from "./connection";
import * as schema from "./schema";

export async function getUsers() {
  const _users = await db.select().from(schema.users);
  return _users;
}

export async function getUserByEmail(email: string) {
  const _users = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .run();
  return _users ?? null;
}

export async function getTableData(tableName: string) {
  const table = (schema as any)[tableName]; // Type assertion to any
  if (table) {
    const data = await db.select().from(table);
    return data;
  } else {
    throw new Error(`Table '${tableName}' not found in the schema.`);
  }
}

import { eq } from "drizzle-orm";
import { db } from "./connection";
import { users } from "./schema";

export async function createUser(
  email: string,
  firstName: string,
  lastName: string
) {
  try {
    const user = await db.select().from(users).where(eq(users.email, email));
    if (user.length > 0) {
      return user[0];
    }

    const result = await db.insert(users).values({
      email,
      first_name: firstName,
      last_name: lastName,
    });

    return result;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

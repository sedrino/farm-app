import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import {
  BillingConfigurationUpdate,
  tableBillingConfiguration,
} from "@/server/db/schema";

export async function updateBillingConfiguration(data: {
  billingConfiguration: BillingConfigurationUpdate;
}) {
  const { billingConfiguration } = data;

  try {
    const updatedConfigurations = await db
      .update(tableBillingConfiguration)
      .set(billingConfiguration)
      .where(
        eq(
          tableBillingConfiguration.billingConfigurationId,
          "your-billing-configuration-id"
        )
      ) // Replace with the actual ID or condition
      .returning();

    return updatedConfigurations[0];
  } catch (error) {
    console.error("Error updating billing configuration:", error);
    throw new Error("Failed to update billing configuration");
  }
}

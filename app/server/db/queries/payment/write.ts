import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { PaymentUpdate, tablePayment } from "@/server/db/schema";

export async function adjustPayment({
  paymentId,
  adjustment,
}: {
  paymentId: string;
  adjustment: {
    amount?: number;
    paymentMethod?: string;
    date?: number; // Assuming the date is a timestamp
  };
}): Promise<PaymentUpdate> {
  const { amount, paymentMethod, date } = adjustment;

  // Update the payment record with the provided adjustments
  const updatedPayments = await db
    .update(tablePayment)
    .set({
      ...(amount !== undefined && { amount }),
      ...(paymentMethod !== undefined && { paymentMethod }),
      ...(date !== undefined && { paymentDate: date }),
    })
    .where(eq(tablePayment.paymentId, paymentId))
    .returning();

  // Return the updated payment record
  return updatedPayments[0];
}

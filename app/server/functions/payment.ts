import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { adjustPayment } from "@/server/db/queries/payment/write";

// Define the input schema
const AdjustPaymentInput = z.object({
  paymentId: z.string().min(1, "Payment ID is required"),
  adjustment: z.object({
    amount: z.number().optional(),
    paymentMethod: z.string().optional(),
    date: z.string().optional(),
  }),
});

export const $adjustPayment = createServerFn(
  "POST",
  async (input: z.input<typeof AdjustPaymentInput>) => {
    try {
      const result = AdjustPaymentInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const adjustedPayment = await adjustPayment(result.data);

      return {
        payment: adjustedPayment,
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: error.message,
        };
      } else {
        return {
          error: "Unknown error",
        };
      }
    }
  }
);

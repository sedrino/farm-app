import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findPayments } from "@/server/db/queries/payment/read";

// Define the input schema
const ListPaymentsInput = z.object({
  page: z.number().min(1).catch(1),
  pageSize: z.number().min(1).catch(50),
  dateRange: z.string().optional(),
  boarderId: z.string().optional(),
  paymentMethod: z.string().optional(),
});

export const $listPayments = createServerFn(
  "GET",
  async (input: z.input<typeof ListPaymentsInput>) => {
    try {
      const result = ListPaymentsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const payments = await findPayments(result.data);

      return {
        data: payments ?? [],
        totalReceived: payments.reduce(
          (acc, payment) => acc + payment.amount,
          0
        ),
        averagePayment:
          payments.length > 0
            ? payments.reduce((acc, payment) => acc + payment.amount, 0) /
              payments.length
            : 0,
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

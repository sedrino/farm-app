import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  findInvoicesPaginated,
  getInvoiceById,
} from "@/server/db/queries/invoice/read";

// Define the input schema
const GetInvoiceByIdInput = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
});

export const $getInvoiceById = createServerFn(
  "GET",
  async (input: z.input<typeof GetInvoiceByIdInput>) => {
    try {
      const result = GetInvoiceByIdInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const invoice = await getInvoiceById(result.data.invoiceId);

      return {
        data: invoice ?? null, // Return null if no invoice is found
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

// Define the input schema for listing invoices
const ListInvoicesInput = z.object({
  page: z.number().catch(1),
  pageSize: z.number().catch(50),
  dateRange: z.string().optional(),
  boarderId: z.string().optional(),
  status: z.enum(["paid", "unpaid", "overdue"]).optional(),
});

export const $listInvoices = createServerFn(
  "GET",
  async (input: z.input<typeof ListInvoicesInput>) => {
    try {
      const result = ListInvoicesInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const invoices = await findInvoicesPaginated(result.data);

      return {
        data: invoices ?? [],
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

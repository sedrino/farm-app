import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  addInvoice,
  editInvoice,
  markInvoicePaid,
  sendInvoice,
} from "@/server/db/queries/invoice/write";

// Define the input schema
const CreateInvoiceInput = z.object({
  invoice: z.object({
    boarderId: z.string().min(1, "Boarder is required"),
    invoiceDate: z.string().min(1, "Invoice date is required"),
    dueDate: z.string().min(1, "Due date is required"),
    notes: z.string().optional(),
  }),
  lineItems: z
    .array(
      z.object({
        description: z.string().min(1, "Description is required"),
        quantity: z.number().min(1, "Quantity is required"),
        unitPrice: z.number().min(0, "Unit price is required"),
      })
    )
    .min(1, "At least one line item is required"),
});

export const $createInvoice = createServerFn(
  "POST",
  async (input: z.input<typeof CreateInvoiceInput>) => {
    try {
      const result = CreateInvoiceInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const invoice = await addInvoice(result.data);

      return {
        invoice,
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

// Define the input schema
const EditInvoiceInput = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  invoice: z.object({
    invoiceDate: z.string().optional(),
    status: z.string().optional(),
    subtotal: z.number().optional(),
    taxAmount: z.number().optional(),
    totalAmount: z.number().optional(),
    items: z
      .array(
        z.object({
          itemId: z.string().min(1, "Item ID is required"),
          description: z.string().optional(),
          amount: z.number().optional(),
        })
      )
      .optional(),
    payments: z
      .array(
        z.object({
          paymentId: z.string().min(1, "Payment ID is required"),
          paymentDate: z.string().optional(),
          amount: z.number().optional(),
        })
      )
      .optional(),
  }),
});

export const $editInvoice = createServerFn(
  "POST",
  async (input: z.input<typeof EditInvoiceInput>) => {
    try {
      const result = EditInvoiceInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const updatedInvoice = await editInvoice(result.data);

      return {
        invoice: updatedInvoice,
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

// Define the input schema
const MarkInvoicePaidInput = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
});

export const $markInvoicePaid = createServerFn(
  "POST",
  async (input: z.input<typeof MarkInvoicePaidInput>) => {
    try {
      const result = MarkInvoicePaidInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const updatedInvoice = await markInvoicePaid(result.data.invoiceId);

      return {
        invoice: updatedInvoice,
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

// Define the input schema
const SendInvoiceInput = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
});

export const $sendInvoice = createServerFn(
  "POST",
  async (input: z.input<typeof SendInvoiceInput>) => {
    try {
      const result = SendInvoiceInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const invoice = await sendInvoice(result.data.invoiceId);

      return {
        invoice,
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

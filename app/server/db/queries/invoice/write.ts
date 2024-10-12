import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { InvoiceInsert, InvoiceUpdate, tableInvoice } from "@/server/db/schema";

export async function addInvoice(data: InvoiceInsert): Promise<InvoiceInsert> {
  try {
    // Insert the invoice data into the tableInvoice
    const [newInvoice] = await db.insert(tableInvoice).values(data).returning();

    // Return the newly created invoice
    return newInvoice;
  } catch (error) {
    console.error("Error adding invoice:", error);
    throw new Error("Failed to add invoice");
  }
}

export async function editInvoice(data: {
  invoiceId: string;
  invoice: {
    invoiceDate?: string;
    status?: string;
    subtotal?: number;
    taxAmount?: number;
    totalAmount?: number;
    items?: { itemId: string; description?: string; amount?: number }[];
    payments?: { paymentId: string; paymentDate?: string; amount?: number }[];
  };
}): Promise<InvoiceUpdate> {
  const { invoiceId, invoice } = data;

  // Update the invoice details
  const [updatedInvoice] = await db
    .update(tableInvoice)
    .set({
      invoiceDate: invoice.invoiceDate
        ? new Date(invoice.invoiceDate).getTime()
        : undefined,
      status: invoice.status,
      subtotal: invoice.subtotal,
      taxAmount: invoice.taxAmount,
      totalAmount: invoice.totalAmount,
    })
    .where(eq(tableInvoice.invoiceId, invoiceId))
    .returning();

  // Note: Updating items and payments may require additional logic and tables,
  // as this example assumes a simple update to the invoice table.

  return updatedInvoice;
}

export async function markInvoicePaid(invoiceId: string) {
  const updatedInvoices = await db
    .update(tableInvoice)
    .set({
      status: "paid",
    })
    .where(eq(tableInvoice.invoiceId, invoiceId))
    .returning();

  return updatedInvoices[0];
}

export async function sendInvoice(invoiceId: string) {
  try {
    // Fetch the invoice details
    const invoiceResults = await db
      .select()
      .from(tableInvoice)
      .where(eq(tableInvoice.invoiceId, invoiceId));

    const invoice = invoiceResults[0];

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // Here you would typically integrate with an email service to send the invoice
    // For example, using nodemailer or any other email service
    // This is a placeholder for the email sending logic

    // Example:
    // await emailService.send({
    //   to: invoice.boarderEmail,
    //   subject: `Invoice #${invoice.invoiceId}`,
    //   body: `Invoice details: ${JSON.stringify(invoice)}`,
    // });

    // Update the invoice status to 'sent' or similar
    await db
      .update(tableInvoice)
      .set({ status: "sent" })
      .where(eq(tableInvoice.invoiceId, invoiceId));

    return {
      success: true,
      message: "Invoice sent successfully",
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

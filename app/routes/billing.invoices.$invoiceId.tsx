import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { useEditInvoiceMutation } from "@/query/mutations/invoices";
import { invoiceOptions } from "@/query/options/invoices";

export const Route = createFileRoute("/billing/invoices/$invoiceId")({
  component: InvoiceDetailsComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      invoiceOptions({
        invoiceId: opts.params.invoiceId,
      })
    );
  },
});

function InvoiceDetailsComponent() {
  const { invoiceId } = Route.useParams();
  const { data: invoice } = useSuspenseQuery(
    invoiceOptions({
      invoiceId,
    })
  );
  const editInvoiceMutation = useEditInvoiceMutation(invoiceId);

  const handleEdit = () => {
    // Logic to edit the invoice
  };

  const handleDelete = () => {
    // Logic to delete the invoice
  };

  const handleSend = () => {
    // Logic to send the invoice
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Invoice Details</h1>
        <div className="mb-4">
          <p>
            <strong>Invoice Number:</strong> {invoice.invoiceId}
          </p>
          <p>
            <strong>Invoice Date:</strong> {formatDate(invoice.invoiceDate)}
          </p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Boarder Information</h2>
          <p>{invoice.boarder?.name}</p>
          <p>{invoice.boarder?.contactDetails}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Itemized Charges</h2>
          <ul>
            {invoice.items.map((item) => (
              <li key={item.itemId}>
                {item.description}: ${item.amount}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Totals</h2>
          <p>Subtotal: ${invoice.subtotal}</p>
          <p>Tax: ${invoice.taxAmount}</p>
          <p>Total: ${invoice.totalAmount}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Payment Status</h2>
          <p>{invoice.status}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Payment History</h2>
          <ul>
            {invoice.payments.map((payment) => (
              <li key={payment.paymentId}>
                {formatDate(payment.paymentDate)}: ${payment.amount}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleEdit}>Edit</Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
          <Button onClick={handleSend}>Send</Button>
        </div>
      </Panel>
    </div>
  );
}

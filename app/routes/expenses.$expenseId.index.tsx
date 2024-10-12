import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { useDeleteExpenseMutation } from "@/query/mutations/expenses";
import { expenseOptions } from "@/query/options/expenses";

export const Route = createFileRoute("/expenses/$expenseId/")({
  component: ExpenseDetailsComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      expenseOptions({
        expenseId: opts.params.expenseId,
      })
    );
  },
});

function ExpenseDetailsComponent() {
  const { expenseId } = Route.useParams();
  const { data } = useSuspenseQuery(
    expenseOptions({
      expenseId,
    })
  );

  const deleteExpenseMutation = useDeleteExpenseMutation(expenseId);

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Expense Details</h1>
        <div className="mb-4">
          <p>
            <strong>Date:</strong> {formatDate(data.date)}
          </p>
          <p>
            <strong>Amount:</strong> ${data.amount}
          </p>
          <p>
            <strong>Category:</strong> {data.category}
          </p>
          <p>
            <strong>Vendor/Payee:</strong> {data.vendor}
          </p>
          <p>
            <strong>Description:</strong> {data.description}
          </p>
          <p>
            <strong>Payment Method:</strong> {data.paymentMethod}
          </p>
          {data.receiptUrl && (
            <p>
              <strong>Receipt:</strong>{" "}
              <a
                href={data.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Receipt
              </a>
            </p>
          )}
          <p>
            <strong>Tags:</strong> {data.tags.join(", ")}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="default">Edit</Button>
          <Button
            variant="destructive"
            onClick={() => deleteExpenseMutation.mutate()}
          >
            Delete
          </Button>
          <Button variant="outline">Mark as Reconciled</Button>
        </div>
      </Panel>
    </div>
  );
}

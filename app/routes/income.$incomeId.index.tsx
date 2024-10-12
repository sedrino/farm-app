import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { useDeleteIncomeMutation } from "@/query/mutations/incomes";
import { incomeDetailsOptions } from "@/query/options/incomes";

export const Route = createFileRoute("/income/$incomeId/")({
  component: IncomeDetailsComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      incomeDetailsOptions({
        incomeId: opts.params.incomeId,
      })
    );
  },
});

function IncomeDetailsComponent() {
  const { incomeId } = Route.useParams();
  const { data } = useSuspenseQuery(
    incomeDetailsOptions({
      incomeId,
    })
  );

  const deleteIncomeMutation = useDeleteIncomeMutation(incomeId);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this income entry?")) {
      deleteIncomeMutation.mutate();
    }
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Income Details</h1>
        <div className="mb-4">
          <p>
            <strong>Amount:</strong> {data.amount}
          </p>
          <p>
            <strong>Date:</strong> {formatDate(data.date)}
          </p>
          <p>
            <strong>Category:</strong> {data.category}
          </p>
          <p>
            <strong>Source:</strong> {data.source}
          </p>
          <p>
            <strong>Description:</strong> {data.description}
          </p>
          <p>
            <strong>Payment Method:</strong> {data.paymentMethod}
          </p>
          <p>
            <strong>Status:</strong> {data.status}
          </p>
          {data.isRecurring && (
            <div>
              <p>
                <strong>Recurrence Pattern:</strong> {data.recurrencePattern}
              </p>
              <p>
                <strong>Next Occurrence Date:</strong>{" "}
                {formatDate(data.nextOccurrenceDate)}
              </p>
            </div>
          )}
        </div>
        <div className="mb-4 flex space-x-2">
          <Button variant="default" asChild>
            <Link to={`/income/${incomeId}/edit`}>Edit</Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
        <div>
          <h2 className="text-xl font-bold">Related Documents</h2>
          <ul>
            {data.documents.map((doc) => (
              <li key={doc.documentId}>
                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                  {doc.fileName}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-bold">Audit Trail</h2>
          <p>
            <strong>Created At:</strong> {formatDate(data.createdAt)}
          </p>
          <p>
            <strong>Last Modified At:</strong> {formatDate(data.updatedAt)}
          </p>
        </div>
      </Panel>
    </div>
  );
}

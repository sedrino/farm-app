import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { useDeleteBoarderMutation } from "@/query/mutations/boarders";
import { boarderDetailsOptions } from "@/query/options/boarders";

export const Route = createFileRoute("/boarders/$boarderId/")({
  component: BoarderProfileComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      boarderDetailsOptions({
        boarderId: opts.params.boarderId,
      })
    );
  },
});

function BoarderProfileComponent() {
  const { boarderId } = Route.useParams();
  const { data: boarder } = useSuspenseQuery(
    boarderDetailsOptions({
      boarderId,
    })
  );

  const deleteBoarderMutation = useDeleteBoarderMutation(boarderId);

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Boarder Profile</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{boarder.name}</h2>
          <p>Contact Details: {boarder.contactDetails}</p>
          <p>Emergency Contact: {boarder.emergencyContact}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Associated Horses</h3>
          <ul>
            {boarder.horses.map((horse) => (
              <li key={horse.horseId}>
                <Link to={`/horses/${horse.horseId}`}>{horse.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Contract Status</h3>
          <p>
            Status: {boarder.contractStatus}{" "}
            <Button variant="link" asChild>
              <Link to={`/contracts/${boarder.contractId}`}>
                View/Edit Contract
              </Link>
            </Button>
          </p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Billing Information</h3>
          <p>{boarder.billingInfo}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Preferences</h3>
          <p>{boarder.preferences}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Notes</h3>
          <p>{boarder.notes}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Recent Invoices</h3>
          <ul>
            {boarder.invoices.map((invoice) => (
              <li key={invoice.invoiceId}>
                <Link to={`/invoices/${invoice.invoiceId}`}>
                  Invoice {formatDate(invoice.invoiceDate)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Timeline of Activities</h3>
          <ul>
            {boarder.activities.map((activity) => (
              <li key={activity.activityId}>
                {formatDate(activity.date)} - {activity.description}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex space-x-2">
          <Button variant="default" asChild>
            <Link to={`/boarders/${boarderId}/edit`}>Edit Profile</Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteBoarderMutation.mutate()}
          >
            Delete Profile
          </Button>
          <Button variant="outline">Send Message</Button>
          <Button variant="outline">Generate Invoice</Button>
        </div>
      </Panel>
    </div>
  );
}

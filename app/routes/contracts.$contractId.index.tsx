import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { contractDetailsOptions } from "@/query/options/contracts";

export const Route = createFileRoute("/contracts/$contractId/")({
  component: ContractDetailsComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      contractDetailsOptions({
        contractId: opts.params.contractId,
      })
    );
  },
});

function ContractDetailsComponent() {
  const { contractId } = Route.useParams();
  const { data: contract } = useSuspenseQuery(
    contractDetailsOptions({
      contractId,
    })
  );

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="text-2xl font-bold">Contract Details</h1>
        <div className="mt-4">
          <h2 className="text-xl">Contract Information</h2>
          <p>Terms and Conditions: {contract.termsAndConditions}</p>
          <p>Start Date: {new Date(contract.startDate).toLocaleDateString()}</p>
          <p>End Date: {new Date(contract.endDate).toLocaleDateString()}</p>
          <p>Payment Terms: {contract.paymentTerms}</p>
        </div>
        <div className="mt-4">
          <h2 className="text-xl">Associated Boarder</h2>
          <p>{contract.boarder.name}</p>
        </div>
        <div className="mt-4">
          <h2 className="text-xl">Associated Horse</h2>
          <p>{contract.horse.name}</p>
        </div>
        <div className="mt-4">
          <h2 className="text-xl">Payment History</h2>
          <ul>
            {contract.payments.map((payment) => (
              <li key={payment.paymentId}>
                {new Date(payment.paymentDate).toLocaleDateString()}:{" "}
                {payment.amount}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <h2 className="text-xl">Timeline of Contract Events</h2>
          <ul>
            {contract.events.map((event) => (
              <li key={event.eventId}>
                {new Date(event.eventDate).toLocaleDateString()}:{" "}
                {event.description}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <h2 className="text-xl">Attached Documents</h2>
          <ul>
            {contract.documents.map((document) => (
              <li key={document.documentId}>
                <a
                  href={document.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {document.fileName}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <h2 className="text-xl">Comments or Notes</h2>
          <textarea className="w-full border p-2" rows={4} />
        </div>
        <div className="mt-4 flex space-x-2">
          <Button variant="default">Edit Contract</Button>
          <Button variant="destructive">Terminate Contract</Button>
          <Button variant="outline">Renew Contract</Button>
          <Button variant="outline">Generate Invoice</Button>
          <Button variant="outline">Send Message to Boarder</Button>
        </div>
      </Panel>
    </div>
  );
}

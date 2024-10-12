import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useGenerateContractMutation } from "@/query/mutations/contracts";
import { contractOptions } from "@/query/options/contracts";

export const Route = createFileRoute("/boarders/$boarderId/contract/")({
  component: BoarderContractComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      contractOptions({
        boarderId: opts.params.boarderId,
      })
    );
  },
});

function BoarderContractComponent() {
  const { boarderId } = Route.useParams();
  const { data: contract } = useSuspenseQuery(
    contractOptions({
      boarderId,
    })
  );
  const generateContractMutation = useGenerateContractMutation(boarderId);

  const handleGenerateContract = () => {
    generateContractMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Boarder Contract</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Current Contract Details</h2>
          <p>Start Date: {new Date(contract.startDate).toLocaleDateString()}</p>
          <p>End Date: {new Date(contract.endDate).toLocaleDateString()}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Terms and Conditions</h2>
          <pre>{contract.termsAndConditions}</pre>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Contract Actions</h2>
          <Button variant="default" onClick={handleGenerateContract}>
            Generate New Contract
          </Button>
          <Button variant="default">Renew Contract</Button>
          <Button variant="default">Upload Signed Contract</Button>
          <Button variant="default">Edit Contract</Button>
          <Button variant="default">Print Contract</Button>
          <Button variant="default">Email Contract</Button>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Contract History</h2>
          <ul>
            {contract.history.map((item) => (
              <li key={item.contractId}>
                {new Date(item.date).toLocaleDateString()} - {item.status}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">E-Signature</h2>
          <Button variant="default">Sign Contract</Button>
        </div>
      </Panel>
    </div>
  );
}

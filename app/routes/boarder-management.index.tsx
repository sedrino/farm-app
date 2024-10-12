import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { boardersListOptions } from "@/query/options/boarders";
import { contractsListOptions } from "@/query/options/contracts";
import { messagesListOptions } from "@/query/options/messages";

export const Route = createFileRoute("/boarder-management/")({
  component: BoarderManagementDashboard,
  loader: (opts) => {
    return Promise.all([
      opts.context.queryClient.ensureQueryData(
        boardersListOptions({
          page: 1,
          pageSize: 100,
        })
      ),
      opts.context.queryClient.ensureQueryData(
        contractsListOptions({
          page: 1,
          pageSize: 100,
        })
      ),
      opts.context.queryClient.ensureQueryData(
        messagesListOptions({
          page: 1,
          pageSize: 100,
        })
      ),
    ]);
  },
});

function BoarderManagementDashboard() {
  const { data: boarders } = useSuspenseQuery(
    boardersListOptions({
      page: 1,
      pageSize: 100,
    })
  );
  const { data: contracts } = useSuspenseQuery(
    contractsListOptions({
      page: 1,
      pageSize: 100,
    })
  );
  const { data: messages } = useSuspenseQuery(
    messagesListOptions({
      page: 1,
      pageSize: 100,
    })
  );

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">
          Boarder Management Dashboard
        </h1>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl">Total Boarders: {boarders.length}</h2>
          </div>
          <div>
            <Button variant="default" asChild>
              <Link to={"/boarders/create"}>Create New Boarder</Link>
            </Button>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl">Recent Activities</h2>
          <ul>
            <li>New Boarders: {boarders.slice(0, 5).map((b) => b.name)}</li>
            <li>
              Contract Updates: {contracts.slice(0, 5).map((c) => c.status)}
            </li>
            <li>
              Recent Messages: {messages.slice(0, 5).map((m) => m.content)}
            </li>
          </ul>
        </div>
        <div className="flex space-x-4">
          <Button variant="link" asChild>
            <Link to={"/boarders"}>View Boarders</Link>
          </Button>
          <Button variant="link" asChild>
            <Link to={"/contracts"}>View Contracts</Link>
          </Button>
          <Button variant="link" asChild>
            <Link to={"/communication-portal"}>Communication Portal</Link>
          </Button>
        </div>
      </Panel>
      <aside className="w-64">
        <Panel className="p-4">
          <h2 className="text-xl">Boarder Management Features</h2>
          <ul>
            <li>
              <Button variant="link" asChild>
                <Link to={"/boarders"}>Boarder Profiles</Link>
              </Button>
            </li>
            <li>
              <Button variant="link" asChild>
                <Link to={"/contracts"}>Contract Management</Link>
              </Button>
            </li>
            <li>
              <Button variant="link" asChild>
                <Link to={"/billing"}>Billing and Invoicing</Link>
              </Button>
            </li>
            <li>
              <Button variant="link" asChild>
                <Link to={"/communication-portal"}>Communication Portal</Link>
              </Button>
            </li>
          </ul>
        </Panel>
      </aside>
    </div>
  );
}

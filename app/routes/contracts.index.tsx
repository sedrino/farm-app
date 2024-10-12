import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { useTerminateContractMutation } from "@/query/mutations/boarding-contracts";
import { boardingContractsListOptions } from "@/query/options/boarding-contracts";

const contractsSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["startDate", "endDate", "status"]).catch("startDate"),
});

export const Route = createFileRoute("/contracts/")({
  component: ContractsPageComponent,
  validateSearch: zodSearchValidator(contractsSearchSchema),
  loaderDeps: ({ search: { page, pageSize, search, sort } }) => ({
    page,
    pageSize,
    search,
    sort,
  }),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      boardingContractsListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
        search: opts.deps.search,
        sort: opts.deps.sort,
      })
    );
  },
});

function ContractsPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    boardingContractsListOptions({
      page: search.page,
      pageSize: search.pageSize,
      search: search.search,
      sort: search.sort,
    })
  );

  const columnHelper = React.useMemo(
    () => createColumnHelper<(typeof data)[0]>(),
    []
  );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("boarder.name", {
        header: "Boarder Name",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link
              to={`/contracts/${info.row.original.contractId}`}
              params={{ contractId: info.row.original.contractId }}
            >
              {info.getValue()}
            </Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("startDate", {
        header: "Start Date",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("endDate", {
        header: "End Date",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={`/contracts/${info.row.original.contractId}/edit`}
                params={{
                  contractId: info.row.original.contractId,
                }}
              >
                Edit
              </Link>
            </Button>
            <TerminateContractButton
              contractId={info.row.original.contractId}
            />
          </div>
        ),
      }),
    ],
    [columnHelper]
  );

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <Input placeholder="Search contracts..." />
          <Button variant="default" asChild>
            <Link to="/contracts/create">Create New Contract</Link>
          </Button>
        </div>
        <BasicTable
          columns={columns}
          data={data}
          caption="List of contracts."
        />
      </Panel>
    </div>
  );
}

function TerminateContractButton({ contractId }: { contractId: string }) {
  const terminateContractMutation = useTerminateContractMutation(contractId);
  return (
    <Button
      variant="destructive"
      onClick={() => terminateContractMutation.mutate()}
    >
      Terminate
    </Button>
  );
}

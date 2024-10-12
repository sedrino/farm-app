import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { useDeleteStallMutation } from "@/query/mutations/stalls";
import { stallsListOptions } from "@/query/options/stalls";

const stallsSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["stallNumber", "lastMaintenanceDate"]).catch("stallNumber"),
});

export const Route = createFileRoute("/stalls/")({
  component: StallsPageComponent,
  validateSearch: zodSearchValidator(stallsSearchSchema),
  loaderDeps: ({ search }) => search,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      stallsListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
        search: opts.deps.search,
        sort: opts.deps.sort,
      })
    );
  },
});

function StallsPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    stallsListOptions({
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
      columnHelper.accessor("stallNumber", {
        header: "Stall Number",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link to={`/stalls/${info.row.original.stallId}`}>
              {info.getValue()}
            </Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor((row) => row.horse?.name, {
        id: "currentOccupant",
        header: "Current Occupant (Horse Name)",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("availabilityStatus", {
        header: "Availability Status",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("lastMaintenanceDate", {
        header: "Last Maintenance Date",
        cell: (info) => formatDate(info.getValue()),
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link to={`/stalls/${info.row.original.stallId}/edit`}>Edit</Link>
            </Button>
            <DeleteStallButton stallId={info.row.original.stallId} />
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
          <Button variant="default" asChild>
            <Link to="/stalls/create">Add New Stall</Link>
          </Button>
          {/* Add search and sort controls here */}
        </div>
        <BasicTable columns={columns} data={data} caption="List of stalls." />
      </Panel>
    </div>
  );
}

function DeleteStallButton({ stallId }: { stallId: string }) {
  const deleteStallMutation = useDeleteStallMutation(stallId);
  return (
    <Button variant="destructive" onClick={() => deleteStallMutation.mutate()}>
      Delete
    </Button>
  );
}
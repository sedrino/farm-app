import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useDeleteMaintenanceRequestMutation } from "@/query/mutations/maintenance-requests";
import { maintenanceRequestsListOptions } from "@/query/options/maintenance-requests";

const maintenanceRequestsSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  status: z.enum(["New", "In Progress", "Completed", "Cancelled"]).optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
});

export const Route = createFileRoute("/maintenance-requests/")({
  component: MaintenanceRequestsPageComponent,
  validateSearch: zodSearchValidator(maintenanceRequestsSearchSchema),
  loaderDeps: ({ search }) => search,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      maintenanceRequestsListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
        status: opts.deps.status,
        priority: opts.deps.priority,
      })
    );
  },
});

function MaintenanceRequestsPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    maintenanceRequestsListOptions({
      page: search.page,
      pageSize: search.pageSize,
      status: search.status,
      priority: search.priority,
    })
  );

  const columnHelper = React.useMemo(
    () => createColumnHelper<(typeof data)[0]>(),
    []
  );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("maintenanceRequestId", {
        header: "Request ID",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("title", {
        header: "Title",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link
              to={"/maintenance-requests/$requestId/edit"}
              params={{ requestId: info.row.original.maintenanceRequestId }}
            >
              {info.getValue()}
            </Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("requestorName", {
        header: "Requestor Name",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("submissionDate", {
        header: "Submission Date",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("description", {
        header: "Description",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("priority", {
        header: "Priority",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("assignedStaff", {
        header: "Assigned Staff",
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={"/maintenance-requests/$requestId/edit"}
                params={{
                  requestId: info.row.original.maintenanceRequestId,
                }}
              >
                Edit
              </Link>
            </Button>
            <DeleteMaintenanceRequestButton
              requestId={info.row.original.maintenanceRequestId}
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
          <Button variant="default" asChild>
            <Link to={"/maintenance-requests/create"}>Submit New Request</Link>
          </Button>
        </div>
        <BasicTable
          columns={columns}
          data={data}
          caption="List of maintenance requests."
        />
      </Panel>
    </div>
  );
}

function DeleteMaintenanceRequestButton({ requestId }: { requestId: string }) {
  const deleteMaintenanceRequestMutation =
    useDeleteMaintenanceRequestMutation(requestId);
  return (
    <Button
      variant="destructive"
      onClick={() => deleteMaintenanceRequestMutation.mutate()}
    >
      Delete
    </Button>
  );
}
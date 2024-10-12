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
import { useDeleteStaffMutation } from "@/query/mutations/staff";
import { staffListOptions } from "@/query/options/staff";

const staffSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["name", "role", "status"]).catch("name"),
});

export const Route = createFileRoute("/farm-operations/staff/")({
  component: StaffPageComponent,
  validateSearch: zodSearchValidator(staffSearchSchema),
  loaderDeps: ({ search: { page, pageSize, search, sort } }) => ({
    page,
    pageSize,
    search,
    sort,
  }),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      staffListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
      })
    );
  },
});

function StaffPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    staffListOptions({
      page: search.page,
      pageSize: search.pageSize,
    })
  );

  const columnHelper = React.useMemo(
    () => createColumnHelper<(typeof data)[0]>(),
    []
  );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link
              to={"/staff/$staffId/schedule"}
              params={{ staffId: info.row.original.staffId }}
            >
              {info.getValue()}
            </Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("role", {
        header: "Role",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("contactInformation", {
        header: "Contact Information",
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
                to={"/staff/$staffId/edit"}
                params={{
                  staffId: info.row.original.staffId,
                }}
              >
                Edit
              </Link>
            </Button>
            <DeleteStaffButton staffId={info.row.original.staffId} />
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
          <Input placeholder="Search staff members..." />
          <Button variant="default" asChild>
            <Link to={"/staff/create"}>Add New Staff Member</Link>
          </Button>
        </div>
        <BasicTable
          columns={columns}
          data={data}
          caption="List of staff members."
        />
      </Panel>
    </div>
  );
}

function DeleteStaffButton({ staffId }: { staffId: string }) {
  const deleteStaffMutation = useDeleteStaffMutation(staffId);
  return (
    <Button variant="destructive" onClick={() => deleteStaffMutation.mutate()}>
      Delete
    </Button>
  );
}
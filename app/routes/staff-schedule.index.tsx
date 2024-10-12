import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useDeleteShiftMutation } from "@/query/mutations/shifts";
import { shiftsListOptions } from "@/query/options/shifts";

const staffScheduleSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["date", "staff", "role"]).catch("date"),
});

export const Route = createFileRoute("/staff-schedule/")({
  component: StaffSchedulePageComponent,
  validateSearch: zodSearchValidator(staffScheduleSearchSchema),
  loaderDeps: ({ search: { page, pageSize, search, sort } }) => ({
    page,
    pageSize,
    search,
    sort,
  }),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      shiftsListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
      })
    );
  },
});

function StaffSchedulePageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    shiftsListOptions({
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
      columnHelper.accessor("staffName", {
        header: "Staff Name",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link
              to={"/staff/$staffId/edit"}
              params={{ staffId: info.row.original.staffId }}
            >
              {info.getValue()}
            </Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("shiftTime", {
        header: "Shift Time",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("role", {
        header: "Role",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("assignedArea", {
        header: "Assigned Area",
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={"/staff-schedule/$shiftId/edit"}
                params={{
                  shiftId: info.row.original.shiftId,
                }}
              >
                Edit
              </Link>
            </Button>
            <DeleteShiftButton shiftId={info.row.original.shiftId} />
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
            <Link to={"/staff-schedule/create"}>Add Shift</Link>
          </Button>
          <Button variant="default">Print Schedule</Button>
          <Button variant="default">Export to CSV</Button>
        </div>
        <BasicTable
          columns={columns}
          data={data}
          caption="Current Staff Schedule"
        />
      </Panel>
    </div>
  );
}

function DeleteShiftButton({ shiftId }: { shiftId: string }) {
  const deleteShiftMutation = useDeleteShiftMutation(shiftId);
  return (
    <Button variant="destructive" onClick={() => deleteShiftMutation.mutate()}>
      Delete
    </Button>
  );
}
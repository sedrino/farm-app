import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useEditScheduleMutation } from "@/query/mutations/schedules";
import { staffSchedulesListOptions } from "@/query/options/staff-schedules";

const staffSchedulingSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  week: z.string().optional(),
  role: z.string().optional(),
});

export const Route = createFileRoute("/farm-operations/staff-scheduling/")({
  component: StaffSchedulingDashboardComponent,
  validateSearch: zodSearchValidator(staffSchedulingSearchSchema),
  loaderDeps: ({ search: { page, pageSize, week, role } }) => ({
    page,
    pageSize,
    week,
    role,
  }),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      staffSchedulesListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
        week: opts.deps.week,
        role: opts.deps.role,
      })
    );
  },
});

function StaffSchedulingDashboardComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    staffSchedulesListOptions({
      page: search.page,
      pageSize: search.pageSize,
      week: search.week,
      role: search.role,
    })
  );

  const columnHelper = React.useMemo(
    () => createColumnHelper<(typeof data)[0]>(),
    []
  );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("staffMemberName", {
        header: "Staff Member",
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
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={"/farm-operations/staff-scheduling/edit"}
                params={{
                  scheduleId: info.row.original.scheduleId,
                }}
              >
                Edit Schedule
              </Link>
            </Button>
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
            <Link to={"/farm-operations/staff-scheduling/create"}>
              Create New Schedule
            </Link>
          </Button>
          <Button variant="default" asChild>
            <Link to={"/staff"}>View All Staff</Link>
          </Button>
          <Button variant="default">Generate Report</Button>
        </div>
        <BasicTable
          columns={columns}
          data={data}
          caption="Staff Scheduling for the Week"
        />
      </Panel>
    </div>
  );
}

import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { format, parse } from "date-fns";
import { enUS } from "date-fns/locale";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useAssignShiftMutation } from "@/query/mutations/shifts";
import { staffOptions } from "@/query/options/staff";
import { staffScheduleOptions } from "@/query/options/staff-schedules";

export const Route = createFileRoute("/farm-operations/staff/$staffId/")({
  component: StaffScheduleComponent,
  loader: (opts) => {
    return Promise.all([
      opts.context.queryClient.ensureQueryData(
        staffOptions({
          staffId: opts.params.staffId,
        })
      ),
      opts.context.queryClient.ensureQueryData(
        staffScheduleOptions({
          staffId: opts.params.staffId,
        })
      ),
    ]);
  },
});

function StaffScheduleComponent() {
  const { staffId } = Route.useParams();
  const { data: staff } = useSuspenseQuery(
    staffOptions({
      staffId,
    })
  );
  const { data: schedule } = useSuspenseQuery(
    staffScheduleOptions({
      staffId,
    })
  );

  const columnHelper = React.useMemo(
    () => createColumnHelper<(typeof schedule)[0]>(),
    []
  );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("date", {
        header: "Date",
        cell: (info) => format(info.getValue(), "MMMM d, yyyy"),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("startTime", {
        header: "Start Time",
        cell: (info) => format(info.getValue(), "h:mm a"),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("endTime", {
        header: "End Time",
        cell: (info) => format(info.getValue(), "h:mm a"),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("position", {
        header: "Position",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("assignedArea", {
        header: "Assigned Area",
        footer: (info) => info.column.id,
      }),
    ],
    [columnHelper]
  );

  const assignShiftMutation = useAssignShiftMutation(staffId);

  const handleAssignShift = () => {
    // Logic to assign a shift (e.g., open a modal or form)
    assignShiftMutation.mutate({
      staffId,
      date: new Date().getTime(),
      startTime: 0,
      endTime: 0,
      position: "Unknown",
      assignedArea: "Unknown",
    });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">
          {staff.name} - {staff.position}
        </h1>
        <div className="mb-4 flex items-center justify-between">
          <Button variant="default" asChild>
            <Link
              to={"/farm-operations/staff/$staffId/edit"}
              params={{ staffId }}
            >
              Edit Profile
            </Link>
          </Button>
          <Button variant="default" onClick={handleAssignShift}>
            Assign Shift
          </Button>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-bold">Upcoming Shifts</h2>
          <BasicTable
            columns={columns}
            data={schedule}
            caption="List of upcoming shifts."
          />
        </div>
      </Panel>
    </div>
  );
}

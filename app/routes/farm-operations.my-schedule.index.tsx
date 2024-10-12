import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { useStaffScheduleMutation } from "@/query/mutations/staff-schedules";
import { staffScheduleOptions } from "@/query/options/staff-schedules";

export const Route = createFileRoute("/farm-operations/my-schedule/")({
  component: MyScheduleComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      staffScheduleOptions({
        staffId: opts.params.staffId,
      })
    );
  },
});

function MyScheduleComponent() {
  const { staffId } = Route.useParams();
  const { data: schedule } = useSuspenseQuery(
    staffScheduleOptions({
      staffId,
    })
  );

  const staffScheduleMutation = useStaffScheduleMutation(staffId);

  const handleTimeOffRequest = () => {
    // Logic to request time off
  };

  const handleShiftChangeRequest = () => {
    // Logic to request shift change
  };

  const handlePrintSchedule = () => {
    // Logic to print schedule
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="text-2xl font-bold">
          {schedule.staffMember.name} - {schedule.staffMember.role}
        </h1>
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Monthly Calendar View</h2>
          {/* Calendar component showing scheduled shifts */}
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Upcoming Shifts</h2>
          <ul>
            {schedule.shifts.map((shift) => (
              <li key={shift.shiftId}>
                {formatDate(shift.date)}: {shift.startTime} - {shift.endTime} (
                {shift.task})
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 flex space-x-2">
          <Button onClick={handleTimeOffRequest}>Request Time Off</Button>
          <Button onClick={handleShiftChangeRequest}>
            Request Shift Change
          </Button>
          <Button onClick={handlePrintSchedule}>Print Schedule</Button>
        </div>
      </Panel>
    </div>
  );
}

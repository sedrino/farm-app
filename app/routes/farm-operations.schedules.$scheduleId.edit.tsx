import React from "react";
import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { queryClient } from "@/query/client";
import { useUpdateScheduleMutation } from "@/query/mutations/schedules";
import { scheduleOptions } from "@/query/options/schedules";
import { staffListOptions } from "@/query/options/staff";

export const Route = createFileRoute(
  "/farm-operations/schedules/$scheduleId/edit"
)({
  component: EditScheduleComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      scheduleOptions({
        scheduleId: opts.params.scheduleId,
      })
    );
  },
});

const scheduleFormSchema = z.object({
  schedule: z.object({
    name: z.string().min(1, "Schedule name is required"),
    startDate: z.number().min(1, "Start date is required"),
    endDate: z.number().min(1, "End date is required"),
    status: z.string().min(1, "Status is required"),
  }),
  shifts: z
    .array(
      z.object({
        staffId: z.string().min(1, "Staff member is required"),
        startTime: z.number().min(1, "Start time is required"),
        endTime: z.number().min(1, "End time is required"),
      })
    )
    .min(1, "At least one shift is required"),
});

function EditScheduleComponent() {
  const { scheduleId } = Route.useParams();
  const { data: schedule } = useSuspenseQuery(
    scheduleOptions({
      scheduleId,
    })
  );
  const { data: staff } = useSuspenseQuery(
    staffListOptions({
      page: 1,
      pageSize: 100,
    })
  );

  const updateScheduleMutation = useUpdateScheduleMutation(scheduleId);

  const form = useForm({
    defaultValues: {
      schedule: {
        name: schedule.name,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        status: schedule.status,
      },
      shifts: schedule.shifts.map((shift) => ({
        staffId: shift.staffId,
        startTime: shift.startTime,
        endTime: shift.endTime,
      })),
    } as z.infer<typeof scheduleFormSchema>,
    onSubmit: async ({ value }) => {
      await updateScheduleMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    validatorAdapter: zodValidator(),
  });

  const handleCancel = () => {
    // Navigate back to the main scheduling dashboard
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Edit Schedule</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="schedule.name"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Schedule Name
                </label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-2 text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          />

          {/* Calendar view for the schedule */}
          <div>
            <h2 className="text-lg font-semibold">Schedule Details</h2>
            <p>
              Start Date: {new Date(schedule.startDate).toLocaleDateString()}
            </p>
            <p>End Date: {new Date(schedule.endDate).toLocaleDateString()}</p>
            <p>Status: {schedule.status}</p>
          </div>

          {/* Shifts management */}
          <div>
            <h2 className="text-lg font-semibold">Shifts</h2>
            {form.getFieldValue("shifts").map((_, index) => (
              <div key={index} className="mb-2 flex space-x-2">
                <form.Field
                  name={`shifts[${index}].staffId`}
                  children={(field) => (
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff" />
                      </SelectTrigger>
                      <SelectContent>
                        {staff?.map((staffMember) => (
                          <SelectItem
                            key={staffMember.userId}
                            value={staffMember.userId}
                          >
                            {staffMember.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <form.Field
                  name={`shifts[${index}].startTime`}
                  children={(field) => (
                    <Input
                      type="time"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                />
                <form.Field
                  name={`shifts[${index}].endTime`}
                  children={(field) => (
                    <Input
                      type="time"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                />
                <Button
                  type="button"
                  onClick={() =>
                    form.setFieldValue("shifts", (prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                  variant="outline"
                >
                  Remove Shift
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                form.setFieldValue("shifts", [
                  ...form.getFieldValue("shifts"),
                  { staffId: "", startTime: 0, endTime: 0 },
                ])
              }
              variant="outline"
            >
              Add Shift
            </Button>
          </div>

          <div className="flex space-x-2">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "..." : "Save Changes"}
                </Button>
              )}
            />
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}

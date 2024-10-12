import React from "react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { queryClient } from "@/query/client";
import { useCreateScheduleMutation } from "@/query/mutations/schedules";

export const Route = createFileRoute("/farm-operations/schedules/create")({
  component: CreateScheduleComponent,
});

const scheduleFormSchema = z.object({
  schedule: z.object({
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    shiftTimes: z.array(
      z.object({
        shiftStart: z.string().min(1, "Shift start time is required"),
        shiftEnd: z.string().min(1, "Shift end time is required"),
        staffId: z.string().min(1, "Staff member is required"),
      })
    ),
  }),
  repeatPattern: z.enum(["none", "weekly", "bi-weekly"]).default("none"),
});

function CreateScheduleComponent() {
  const navigate = Route.useNavigate();
  const createScheduleMutation = useCreateScheduleMutation();
  const form = useForm({
    defaultValues: {
      schedule: {
        startDate: "",
        endDate: "",
        shiftTimes: [],
      },
      repeatPattern: "none",
    } as z.infer<typeof scheduleFormSchema>,
    onSubmit: async ({ value }) => {
      await createScheduleMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      navigate({ to: "/farm-operations/schedules" });
    },
    validatorAdapter: zodValidator(),
  });

  const handleAddShift = () => {
    form.setFieldValue("schedule.shiftTimes", [
      ...form.getFieldValue("schedule.shiftTimes"),
      { shiftStart: "", shiftEnd: "", staffId: "" },
    ]);
  };

  const handleCancel = () => {
    navigate({ to: "/farm-operations/schedules" });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Create New Work Schedule</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="schedule.startDate"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>
                <input
                  id={field.name}
                  type="date"
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

          <form.Field
            name="schedule.endDate"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>
                <input
                  id={field.name}
                  type="date"
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Shift Times
            </label>
            {form.getFieldValue("schedule.shiftTimes").map((_, index) => (
              <div key={index} className="mb-2 flex space-x-2">
                <form.Field
                  name={`schedule.shiftTimes[${index}].shiftStart`}
                  children={(field) => (
                    <input
                      type="time"
                      placeholder="Shift Start"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                />
                <form.Field
                  name={`schedule.shiftTimes[${index}].shiftEnd`}
                  children={(field) => (
                    <input
                      type="time"
                      placeholder="Shift End"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                />
                <form.Field
                  name={`schedule.shiftTimes[${index}].staffId`}
                  children={(field) => (
                    <select
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    >
                      <option value="">Select Staff</option>
                      {/* Map through available staff members */}
                      {/* {availableStaff.map((staff) => (
                        <option key={staff.staffId} value={staff.staffId}>
                          {staff.name}
                        </option>
                      ))} */}
                    </select>
                  )}
                />
                <Button
                  type="button"
                  onClick={() =>
                    form.setFieldValue("schedule.shiftTimes", (prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                  variant="outline"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" onClick={handleAddShift} variant="outline">
              Add Shift
            </Button>
          </div>

          <form.Field
            name="repeatPattern"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Repeat Pattern
                </label>
                <select
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                >
                  <option value="none">None</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-Weekly</option>
                </select>
              </div>
            )}
          />

          <div className="flex space-x-2">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "..." : "Save Schedule"}
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

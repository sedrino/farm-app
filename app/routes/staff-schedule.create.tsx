import React from "react";
import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/query/client";
import { useCreateShiftMutation } from "@/query/mutations/shifts";
import { staffListOptions } from "@/query/options/staff";
import { staffRolesListOptions } from "@/query/options/staff-roles";

export const Route = createFileRoute("/staff-schedule/create")({
  component: CreateShiftComponent,
});

const shiftFormSchema = z.object({
  shift: z.object({
    staffId: z.string().min(1, "Staff member is required"),
    role: z.string().min(1, "Role is required"),
    date: z.string().min(1, "Date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    isRecurring: z.boolean().default(false),
    recurrenceFrequency: z.string().optional(),
    notes: z.string().optional(),
  }),
});

function CreateShiftComponent() {
  const navigate = Route.useNavigate();
  const createShiftMutation = useCreateShiftMutation();
  const { data: staffMembers } = useSuspenseQuery(
    staffListOptions({
      page: 1,
      pageSize: 100,
    })
  );
  const { data: staffRoles } = useSuspenseQuery(
    staffRolesListOptions({
      page: 1,
      pageSize: 100,
    })
  );

  const form = useForm({
    defaultValues: {
      shift: {
        staffId: "",
        role: "",
        date: "",
        startTime: "",
        endTime: "",
        isRecurring: false,
        recurrenceFrequency: "",
        notes: "",
      },
    } as z.infer<typeof shiftFormSchema>,
    onSubmit: async ({ value }) => {
      await createShiftMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      navigate({ to: "/staff-schedule" });
    },
    validatorAdapter: zodValidator(),
  });

  const handleCancel = () => {
    navigate({ to: "/staff-schedule" });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Create New Shift</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="shift.staffId"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Staff Member
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffMembers?.map((staff) => (
                      <SelectItem
                        key={staff.userId}
                        value={staff.userId}
                      >{`${staff.firstName} ${staff.lastName}`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-2 text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          />

          <form.Field
            name="shift.role"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Role or Area Assignment
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffRoles?.map((role) => (
                      <SelectItem key={role.roleId} value={role.name}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-2 text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          />

          <form.Field
            name="shift.date"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <DatePicker
                  id={field.name}
                  value={field.state.value}
                  onChange={(date) => field.handleChange(date.toString())}
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
            name="shift.startTime"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Time
                </label>
                <Input
                  id={field.name}
                  type="time"
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
            name="shift.endTime"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  End Time
                </label>
                <Input
                  id={field.name}
                  type="time"
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
            name="shift.isRecurring"
            children={(field) => (
              <div className="flex items-center">
                <Input
                  id={field.name}
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(e) =>
                    field.handleChange(e.target.checked ? true : false)
                  }
                />
                <label
                  htmlFor={field.name}
                  className="ml-2 text-sm text-gray-700"
                >
                  Recurring Shift
                </label>
              </div>
            )}
          />

          {form.getFieldValue("shift.isRecurring") && (
            <form.Field
              name="shift.recurrenceFrequency"
              children={(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Recurrence Frequency
                  </label>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-2 text-sm text-red-600">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            />
          )}

          <form.Field
            name="shift.notes"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Notes
                </label>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          />

          <div className="flex space-x-2">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "..." : "Save"}
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

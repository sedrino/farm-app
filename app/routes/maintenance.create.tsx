import React from "react";
import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { useCreateMaintenanceTaskMutation } from "@/query/mutations/maintenance-tasks";
import { staffListOptions } from "@/query/options/staff";
import { stallsListOptions } from "@/query/options/stalls";

export const Route = createFileRoute("/maintenance/create")({
  component: CreateMaintenanceTaskComponent,
});

const maintenanceTaskFormSchema = z.object({
  task: z.object({
    taskName: z.string().min(1, "Task name is required"),
    description: z.string().min(1, "Description is required"),
    scheduledDate: z.string().min(1, "Scheduled date is required"),
    startTime: z.string().min(1, "Start time is required"),
    estimatedDuration: z.number().min(1, "Duration is required"),
    priority: z.enum(["low", "medium", "high"]).default("medium"),
    assignedStaff: z.array(z.string()).optional(),
    recurrencePattern: z
      .enum(["one-time", "daily", "weekly", "monthly"])
      .default("one-time"),
    specialInstructions: z.string().optional(),
  }),
  stalls: z.array(z.string()).min(1, "At least one stall must be selected"),
});

function CreateMaintenanceTaskComponent() {
  const navigate = Route.useNavigate();
  const createMaintenanceTaskMutation = useCreateMaintenanceTaskMutation();
  const { data: staff } = useSuspenseQuery(staffListOptions());
  const { data: stalls } = useSuspenseQuery(stallsListOptions());

  const form = useForm({
    defaultValues: {
      task: {
        taskName: "",
        description: "",
        scheduledDate: "",
        startTime: "",
        estimatedDuration: 1,
        priority: "medium",
        assignedStaff: [],
        recurrencePattern: "one-time",
        specialInstructions: "",
      },
      stalls: [],
    } as z.infer<typeof maintenanceTaskFormSchema>,
    onSubmit: async ({ value }) => {
      await createMaintenanceTaskMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["maintenance-tasks"] });
      navigate({ to: "/maintenance" });
    },
    validatorAdapter: zodValidator(),
  });

  const handleCancel = () => {
    navigate({ to: "/maintenance" });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Create Maintenance Task</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="task.taskName"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Task Name
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

          <form.Field
            name="task.description"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <Textarea
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

          <form.Field
            name="task.scheduledDate"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Scheduled Date
                </label>
                <Input
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
            name="task.startTime"
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
            name="task.estimatedDuration"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Estimated Duration (hours)
                </label>
                <Input
                  id={field.name}
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
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
            name="task.priority"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Priority
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <form.Field
            name="task.assignedStaff"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Assigned Staff
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value.split(","))
                  }
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
              </div>
            )}
          />

          <form.Field
            name="task.recurrencePattern"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Recurrence Pattern
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recurrence pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One-Time</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <form.Field
            name="task.specialInstructions"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Special Instructions
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

          <form.Field
            name="stalls"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Associated Stall(s)
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value.split(","))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stalls" />
                  </SelectTrigger>
                  <SelectContent>
                    {stalls?.map((stall) => (
                      <SelectItem key={stall.stallId} value={stall.stallId}>
                        {stall.number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

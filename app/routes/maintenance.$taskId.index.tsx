import React from "react";
import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import { queryClient } from "@/query/client";
import {
  useCompleteMaintenanceTaskMutation,
  useDeleteMaintenanceTaskMutation,
  useUpdateMaintenanceTaskMutation,
} from "@/query/mutations/maintenance-tasks";
import { maintenanceTaskOptions } from "@/query/options/maintenance-tasks";

export const Route = createFileRoute("/maintenance/$taskId/")({
  component: MaintenanceTaskDetailsComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      maintenanceTaskOptions({
        taskId: opts.params.taskId,
      })
    );
  },
});

const maintenanceTaskFormSchema = z.object({
  task: z.object({
    taskName: z.string().min(1, "Task name is required"),
    scheduledDate: z.string().min(1, "Scheduled date is required"),
    estimatedDuration: z.number().min(1, "Estimated duration is required"),
    priority: z.string().min(1, "Priority is required"),
    status: z.string().min(1, "Status is required"),
    recurrencePattern: z.string().optional(),
    specialInstructions: z.string().optional(),
    completionDate: z.string().optional(),
    completionTime: z.number().optional(),
    cost: z.number().optional(),
  }),
});

function MaintenanceTaskDetailsComponent() {
  const { taskId } = Route.useParams();
  const { data } = useSuspenseQuery(
    maintenanceTaskOptions({
      taskId,
    })
  );

  const updateTaskMutation = useUpdateMaintenanceTaskMutation(taskId);
  const completeTaskMutation = useCompleteMaintenanceTaskMutation(taskId);
  const deleteTaskMutation = useDeleteMaintenanceTaskMutation(taskId);

  const form = useForm({
    defaultValues: {
      task: {
        taskName: data.taskName,
        scheduledDate: formatDate(data.scheduledDate),
        estimatedDuration: data.estimatedDuration,
        priority: data.priority,
        status: data.status,
        recurrencePattern: data.recurrencePattern,
        specialInstructions: data.specialInstructions,
        completionDate: data.completionDate,
        completionTime: data.completionTime,
        cost: data.cost,
      },
    } as z.infer<typeof maintenanceTaskFormSchema>,
    onSubmit: async ({ value }) => {
      await updateTaskMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["maintenance-tasks"] });
    },
    validatorAdapter: zodValidator(),
  });

  const handleCompleteTask = () => {
    completeTaskMutation.mutate({
      completionDate: Date.now(),
      completionTime: data.estimatedDuration,
    });
  };

  const handleDeleteTask = () => {
    deleteTaskMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Maintenance Task Details</h1>
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
            name="task.estimatedDuration"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Estimated Duration (in hours)
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
            name="task.status"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
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
            name="task.recurrencePattern"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Recurrence Pattern
                </label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
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

          <div className="flex space-x-2">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "..." : "Save Changes"}
                </Button>
              )}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleCompleteTask}
            >
              Mark as Complete
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteTask}
            >
              Delete Task
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}

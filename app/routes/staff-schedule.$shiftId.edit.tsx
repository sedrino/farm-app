import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { TimeInput } from "@/components/ui/time-input";
import { queryClient } from "@/query/client";
import {
  useDeleteShiftMutation,
  useUpdateShiftMutation,
} from "@/query/mutations/shifts";
import { shiftOptions } from "@/query/options/shifts";

export const Route = createFileRoute("/staff-schedule/$shiftId/edit")({
  component: EditShiftComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      shiftOptions({
        shiftId: opts.params.shiftId,
      })
    );
  },
});

const shiftFormSchema = z.object({
  shift: z.object({
    staffId: z.string().min(1, "Staff member is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    position: z.string().min(1, "Position is required"),
    notes: z.string().optional(),
    status: z.string().min(1, "Status is required"),
  }),
});

function EditShiftComponent() {
  const { shiftId } = Route.useParams();
  const { data: shift } = useSuspenseQuery(
    shiftOptions({
      shiftId,
    })
  );
  const updateShiftMutation = useUpdateShiftMutation(shiftId);
  const deleteShiftMutation = useDeleteShiftMutation(shiftId);

  const form = useForm({
    defaultValues: {
      shift: {
        staffId: shift.staffId,
        startTime: shift.startTime,
        endTime: shift.endTime,
        position: shift.position,
        notes: shift.notes,
        status: shift.status,
      },
    } as z.infer<typeof shiftFormSchema>,
    onSubmit: async ({ value }) => {
      await updateShiftMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
    validatorAdapter: zodValidator(),
  });

  const handleCancel = () => {
    // Navigate back to the schedule page or previous route
  };

  const handleDelete = () => {
    deleteShiftMutation.mutate(undefined, {
      onSuccess: () => {
        // Navigate back to the schedule page or previous route
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Edit Shift</h1>
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
            name="shift.startTime"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Time
                </label>
                <TimeInput
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
            name="shift.endTime"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  End Time
                </label>
                <TimeInput
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
            name="shift.position"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Position
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
            name="shift.notes"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Notes
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
            name="shift.status"
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
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}

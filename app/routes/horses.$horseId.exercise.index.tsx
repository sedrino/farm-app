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
import { queryClient } from "@/query/client";
import {
  useCreateExerciseLogMutation,
  useDeleteExerciseLogMutation,
} from "@/query/mutations/exercise-logs";
import { exerciseLogsListOptions } from "@/query/options/exercise-logs";

export const Route = createFileRoute("/horses/$horseId/exercise/")({
  component: HorseExerciseLogComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      exerciseLogsListOptions({
        horseId: opts.params.horseId,
      })
    );
  },
});

const exerciseLogFormSchema = z.object({
  exerciseLog: z.object({
    date: z.string().min(1, "Date is required"),
    duration: z.number().min(1, "Duration is required"),
    type: z.string().min(1, "Type is required"),
    intensity: z.string().min(1, "Intensity is required"),
    notes: z.string().optional(),
  }),
});

function HorseExerciseLogComponent() {
  const { horseId } = Route.useParams();
  const { data: exerciseLogs } = useSuspenseQuery(
    exerciseLogsListOptions({
      horseId,
    })
  );
  const createExerciseLogMutation = useCreateExerciseLogMutation(horseId);
  const columnHelper = React.useMemo(
    () => createColumnHelper<(typeof exerciseLogs)[0]>(),
    []
  );

  const form = useForm({
    defaultValues: {
      exerciseLog: {
        date: "",
        duration: 0,
        type: "",
        intensity: "",
        notes: "",
      },
    } as z.infer<typeof exerciseLogFormSchema>,
    onSubmit: async ({ value }) => {
      await createExerciseLogMutation.mutateAsync({
        horseId,
        ...value.exerciseLog,
      });
      queryClient.invalidateQueries({
        queryKey: exerciseLogsListOptions({
          horseId,
        }),
      });
    },
    validatorAdapter: zodValidator(),
  });

  const handleDelete = (exerciseLogId: string) => {
    const deleteExerciseLogMutation =
      useDeleteExerciseLogMutation(exerciseLogId);
    deleteExerciseLogMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Log Exercise for Horse</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="exerciseLog.date"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
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
            name="exerciseLog.duration"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Duration (minutes)
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
            name="exerciseLog.type"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Type of Exercise
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
            name="exerciseLog.intensity"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Intensity Level
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
            name="exerciseLog.notes"
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
                  {isSubmitting ? "..." : "Log Exercise"}
                </Button>
              )}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
          </div>
        </form>
      </Panel>

      <Panel className="p-4">
        <h2 className="text-xl font-bold">Logged Exercise Sessions</h2>
        <ul>
          {exerciseLogs.map((log) => (
            <li key={log.exerciseLogId} className="flex justify-between">
              <span>
                {log.date} - {log.type} ({log.duration} min)
              </span>
              <div className="flex space-x-2">
                <Button variant="outline">Edit</Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(log.exerciseLogId)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

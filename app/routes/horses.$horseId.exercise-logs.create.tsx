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
import { useCreateExerciseLogMutation } from "@/query/mutations/exercise-logs";
import { exerciseTypesListOptions } from "@/query/options/exercise-types";

export const Route = createFileRoute("/horses/$horseId/exercise-logs/create")({
  component: CreateExerciseLogComponent,
});

const exerciseLogFormSchema = z.object({
  exerciseLog: z.object({
    horseId: z.string().min(1, "Horse is required"),
    date: z.number().min(1, "Date is required"),
    startTime: z.number().min(1, "Start time is required"),
    endTime: z.number().min(1, "End time is required"),
    type: z.string().min(1, "Type of exercise is required"),
    intensity: z.string().min(1, "Intensity level is required"),
    trainer: z.string().min(1, "Trainer name is required"),
    notes: z.string().optional(),
  }),
  goals: z.array(z.string()).default([]).optional(),
  achievements: z.array(z.string()).default([]).optional(),
  horseBehavior: z.string().optional(),
  areasForImprovement: z.string().optional(),
  mediaUrls: z.array(z.string()).default([]).optional(),
});

function CreateExerciseLogComponent() {
  const { horseId } = Route.useParams();
  const createExerciseLogMutation = useCreateExerciseLogMutation(horseId);
  const { data: exerciseTypes } = useSuspenseQuery(
    exerciseTypesListOptions({
      page: 1,
      pageSize: 100,
    })
  );

  const form = useForm({
    defaultValues: {
      exerciseLog: {
        horseId,
        date: Date.now(),
        startTime: Date.now(),
        endTime: Date.now(),
        type: "",
        intensity: "",
        trainer: "",
        notes: "",
      },
      goals: [],
      achievements: [],
      horseBehavior: "",
      areasForImprovement: "",
      mediaUrls: [],
    } as z.infer<typeof exerciseLogFormSchema>,
    onSubmit: async ({ value }) => {
      await createExerciseLogMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["exercise-logs"] });
    },
    validatorAdapter: zodValidator(),
  });

  const handleCancel = () => {
    // Navigate back to the exercise logs list
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Create New Exercise Log</h1>
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
                  value={
                    new Date(field.state.value).toISOString().split("T")[0]
                  }
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(new Date(e.target.value).getTime())
                  }
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
            name="exerciseLog.startTime"
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
                  value={new Date(field.state.value)
                    .toISOString()
                    .split("T")[1]
                    .slice(0, 5)}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(
                      new Date(`1970-01-01T${e.target.value}:00Z`).getTime()
                    )
                  }
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
            name="exerciseLog.endTime"
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
                  value={new Date(field.state.value)
                    .toISOString()
                    .split("T")[1]
                    .slice(0, 5)}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(
                      new Date(`1970-01-01T${e.target.value}:00Z`).getTime()
                    )
                  }
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
                  Type of Exercise/Training
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
            name="exerciseLog.trainer"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Trainer/Rider Name
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Goals
            </label>
            <form.Field name="goals" mode="array">
              {(field) => (
                <div>
                  <Input
                    placeholder="Goal"
                    onChange={(e) => field.pushValue(e.target.value)}
                  />
                  <div className="mt-2">
                    {field.state.value?.map((goal, index) => (
                      <span
                        key={index}
                        className="mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
                      >
                        {goal}
                        <button
                          type="button"
                          onClick={() =>
                            form.setFieldValue("goals", (prev) =>
                              prev?.filter((_, i) => i !== index)
                            )
                          }
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </form.Field>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Achievements
            </label>
            <form.Field name="achievements" mode="array">
              {(field) => (
                <div>
                  <Input
                    placeholder="Achievement"
                    onChange={(e) => field.pushValue(e.target.value)}
                  />
                  <div className="mt-2">
                    {field.state.value?.map((achievement, index) => (
                      <span
                        key={index}
                        className="mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
                      >
                        {achievement}
                        <button
                          type="button"
                          onClick={() =>
                            form.setFieldValue("achievements", (prev) =>
                              prev?.filter((_, i) => i !== index)
                            )
                          }
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </form.Field>
          </div>

          <form.Field
            name="horseBehavior"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Horse Behavior
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
            name="areasForImprovement"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Areas for Improvement
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Media
            </label>
            <form.Field name="mediaUrls" mode="array">
              {(field) => (
                <div>
                  <Input
                    placeholder="Media URL"
                    onChange={(e) => field.pushValue(e.target.value)}
                  />
                  <div className="mt-2">
                    {field.state.value?.map((mediaUrl, index) => (
                      <span
                        key={index}
                        className="mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
                      >
                        {mediaUrl}
                        <button
                          type="button"
                          onClick={() =>
                            form.setFieldValue("mediaUrls", (prev) =>
                              prev?.filter((_, i) => i !== index)
                            )
                          }
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </form.Field>
          </div>

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

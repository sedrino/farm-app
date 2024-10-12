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
import { useCreateFeedingScheduleMutation } from "@/query/mutations/feeding-schedules";
import { feedTypesListOptions } from "@/query/options/feed-types";

export const Route = createFileRoute("/horses/$horseId/feeding/create")({
  component: CreateFeedingScheduleComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      feedTypesListOptions({
        page: 1,
        pageSize: 100,
      })
    );
  },
});

const feedingScheduleFormSchema = z.object({
  feedingSchedule: z.object({
    horseId: z.string().min(1, "Horse is required"),
    feedingTime: z.string().min(1, "Feeding time is required"),
    feedType: z.string().min(1, "Feed type is required"),
    quantity: z.number().min(1, "Quantity is required"),
    isRecurring: z.string().optional(),
    recurrencePattern: z.string().optional(),
    notes: z.string().optional(),
  }),
});

function CreateFeedingScheduleComponent() {
  const { horseId } = Route.useParams();
  const createFeedingScheduleMutation =
    useCreateFeedingScheduleMutation(horseId);
  const { data: feedTypes } = useSuspenseQuery(
    feedTypesListOptions({
      page: 1,
      pageSize: 100,
    })
  );

  const form = useForm({
    defaultValues: {
      feedingSchedule: {
        horseId,
        feedingTime: "",
        feedType: "",
        quantity: 1,
        isRecurring: undefined,
        recurrencePattern: undefined,
        notes: "",
      },
    } as z.infer<typeof feedingScheduleFormSchema>,
    onSubmit: async ({ value }) => {
      await createFeedingScheduleMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["feeding-schedules"] });
    },
    validatorAdapter: zodValidator(),
  });

  const handleCancel = () => {
    // Redirect to the main feeding schedule page
    // Assuming the route is /horses/$horseId/feeding
    queryClient.invalidateQueries({ queryKey: ["feeding-schedules"] });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Create Feeding Schedule</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="feedingSchedule.feedingTime"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Feeding Time
                </label>
                <Input
                  id={field.name}
                  type="datetime-local"
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
            name="feedingSchedule.feedType"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Feed Type
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select feed type" />
                  </SelectTrigger>
                  <SelectContent>
                    {feedTypes?.map((feedType) => (
                      <SelectItem
                        key={feedType.feedTypeId}
                        value={feedType.name}
                      >
                        {feedType.name}
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
            name="feedingSchedule.quantity"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Quantity
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
            name="feedingSchedule.isRecurring"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Set as Recurring
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recurrence pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <form.Field
            name="feedingSchedule.notes"
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

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
import { useUpdateEventMutation } from "@/query/mutations/events";
import { eventOptions } from "@/query/options/events";

export const Route = createFileRoute("/events/$eventId/edit")({
  component: EditEventComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      eventOptions({
        eventId: opts.params.eventId,
      })
    );
  },
});

const eventFormSchema = z.object({
  event: z.object({
    name: z.string().min(1, "Name is required"),
    eventType: z.string().min(1, "Event type is required"),
    startDate: z.number().min(1, "Start date is required"),
    endDate: z.number().min(1, "End date is required"),
    location: z.string().min(1, "Location is required"),
    description: z.string().optional(),
    maxParticipants: z.number().optional(),
    isPublic: z.boolean().default(false),
    capacity: z.number().optional(),
    revenue: z.number().optional(),
    color: z.string().optional(),
    eventCategory: z.string().optional(),
    recurrencePattern: z.string().optional(),
    isRecurring: z.boolean().default(false),
  }),
});

function EditEventComponent() {
  const { eventId } = Route.useParams();
  const { data } = useSuspenseQuery(
    eventOptions({
      eventId,
    })
  );

  const updateEventMutation = useUpdateEventMutation(eventId);

  const form = useForm({
    defaultValues: {
      event: {
        name: data.name,
        eventType: data.eventType,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        description: data.description,
        maxParticipants: data.maxParticipants,
        isPublic: data.isPublic,
        capacity: data.capacity,
        revenue: data.revenue,
        color: data.color,
        eventCategory: data.eventCategory,
        recurrencePattern: data.recurrencePattern,
        isRecurring: data.isRecurring,
      },
    } as z.infer<typeof eventFormSchema>,
    onSubmit: async ({ value }) => {
      await updateEventMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    validatorAdapter: zodValidator(),
  });

  const handleCancel = () => {
    // Logic to navigate back or discard changes
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Edit Event</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="event.name"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Event Name
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
            name="event.eventType"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Event Type
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clinic">Clinic</SelectItem>
                    <SelectItem value="competition">Competition</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <form.Field
            name="event.startDate"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date
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
              </div>
            )}
          />

          <form.Field
            name="event.endDate"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date
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
              </div>
            )}
          />

          <form.Field
            name="event.location"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
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
            name="event.description"
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
              </div>
            )}
          />

          <form.Field
            name="event.maxParticipants"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Max Participants
                </label>
                <Input
                  id={field.name}
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
              </div>
            )}
          />

          <form.Field
            name="event.isPublic"
            children={(field) => (
              <div className="flex items-center">
                <Input
                  id={field.name}
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
                <label
                  htmlFor={field.name}
                  className="ml-2 text-sm text-gray-700"
                >
                  Public Event
                </label>
              </div>
            )}
          />

          <form.Field
            name="event.capacity"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Capacity
                </label>
                <Input
                  id={field.name}
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
              </div>
            )}
          />

          <form.Field
            name="event.revenue"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Revenue
                </label>
                <Input
                  id={field.name}
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
              </div>
            )}
          />

          <form.Field
            name="event.color"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Color
                </label>
                <Input
                  id={field.name}
                  type="color"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          />

          <form.Field
            name="event.eventCategory"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Event Category
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
            name="event.recurrencePattern"
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
            name="event.isRecurring"
            children={(field) => (
              <div className="flex items-center">
                <Input
                  id={field.name}
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
                <label
                  htmlFor={field.name}
                  className="ml-2 text-sm text-gray-700"
                >
                  Recurring Event
                </label>
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
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
              }}
            >
              Revert to Original
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}

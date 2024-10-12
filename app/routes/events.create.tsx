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
import { useCreateEventMutation } from "@/query/mutations/events";
import { facilitiesListOptions } from "@/query/options/facilities";
import { participantsListOptions } from "@/query/options/participants";

export const Route = createFileRoute("/events/create")({
  component: CreateEventComponent,
});

const eventFormSchema = z.object({
  event: z.object({
    title: z.string().min(1, "Event title is required"),
    eventType: z.string().min(1, "Event type is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    location: z.string().min(1, "Location is required"),
    description: z.string().optional(),
    participantLimit: z.number().optional(),
    associatedCosts: z.number().optional(),
    notificationSettings: z.array(z.string()).default([]).optional(),
  }),
  participants: z.array(z.string()).default([]).optional(),
  attachments: z.array(z.string()).default([]).optional(),
});

function CreateEventComponent() {
  const navigate = Route.useNavigate();
  const createEventMutation = useCreateEventMutation();
  const { data: facilities } = useSuspenseQuery(
    facilitiesListOptions({
      page: 1,
      pageSize: 100,
    })
  );
  const { data: participants } = useSuspenseQuery(
    participantsListOptions({
      page: 1,
      pageSize: 100,
    })
  );

  const form = useForm({
    defaultValues: {
      event: {
        title: "",
        eventType: "",
        startDate: "",
        endDate: "",
        location: "",
        description: "",
        participantLimit: undefined,
        associatedCosts: undefined,
        notificationSettings: [],
      },
      participants: [],
      attachments: [],
    } as z.infer<typeof eventFormSchema>,
    onSubmit: async ({ value }) => {
      await createEventMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate({ to: "/events" });
    },
    validatorAdapter: zodValidator(),
  });

  const handleCancel = () => {
    navigate({ to: "/events" });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Create New Event</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="event.title"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Event Title
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
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="private_booking">
                      Private Booking
                    </SelectItem>
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
                  Start Date and Time
                </label>
                <Input
                  id={field.name}
                  type="datetime-local"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
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
                  End Date and Time
                </label>
                <Input
                  id={field.name}
                  type="datetime-local"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
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
                  Location/Facility
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a facility" />
                  </SelectTrigger>
                  <SelectContent>
                    {facilities?.map((facility) => (
                      <SelectItem
                        key={facility.facilityId}
                        value={facility.facilityId}
                      >
                        {facility.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Participants
            </label>
            <form.Field name="participants" mode="array">
              {(field) => (
                <div>
                  <Select onValueChange={(value) => field.pushValue(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select participants" />
                    </SelectTrigger>
                    <SelectContent>
                      {participants?.map((participant) => (
                        <SelectItem
                          key={participant.participantId}
                          value={participant.participantId}
                        >
                          {participant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>
          </div>

          <form.Field
            name="event.participantLimit"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Participant Limit
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Recurring Event Options
            </label>
            <form.Field name="event.isRecurring" mode="array">
              {(field) => (
                <div>
                  <Select onValueChange={(value) => field.pushValue(value)}>
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
            </form.Field>
          </div>

          <form.Field
            name="event.associatedCosts"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Associated Costs or Fees
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Attachments
            </label>
            <form.Field name="attachments" mode="array">
              {(field) => (
                <div>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        const fileUrls = Array.from(files).map((file) =>
                          URL.createObjectURL(file)
                        );
                        field.handleChange(fileUrls);
                      }
                    }}
                  />
                </div>
              )}
            </form.Field>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notification Settings
            </label>
            <form.Field name="event.notificationSettings" mode="array">
              {(field) => (
                <div>
                  <Select onValueChange={(value) => field.pushValue(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select notification settings" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
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

import React from "react";
import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Panel } from "@/components/ui/panel";
import { eventsListOptions } from "@/query/options/events";
import { reportExportOptions } from "@/query/options/report-export";

export const Route = createFileRoute("/reports/events/")({
  component: EventsReportComponent,
});

const eventsReportSchema = z.object({
  dateRange: z.object({
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  }),
  eventType: z.string().optional(),
  facilityId: z.string().optional(),
  participantId: z.string().optional(),
});

function EventsReportComponent() {
  const { data: events } = useSuspenseQuery(eventsListOptions());
  const { data: reportExports } = useSuspenseQuery(reportExportOptions());

  const form = useForm({
    defaultValues: {
      dateRange: {
        startDate: "",
        endDate: "",
      },
      eventType: "",
      facilityId: "",
      participantId: "",
    } as z.infer<typeof eventsReportSchema>,
    onSubmit: async ({ value }) => {
      // Handle report generation logic here
    },
    validatorAdapter: zodValidator(),
  });

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Events Report</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="dateRange"
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date Range
                </label>
                <DateRangePicker
                  startDate={field.state.value.startDate}
                  endDate={field.state.value.endDate}
                  onChange={(range) => {
                    field.handleChange(range);
                  }}
                />
              </div>
            )}
          />

          <form.Field
            name="eventType"
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Event Type
                </label>
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="clinic">Clinic</option>
                  <option value="competition">Competition</option>
                  <option value="training">Training</option>
                </select>
              </div>
            )}
          />

          <form.Field
            name="facilityId"
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Facility
                </label>
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                >
                  <option value="">All</option>
                  {events?.map((event) => (
                    <option key={event.facilityId} value={event.facilityId}>
                      {event.facilityName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          />

          <form.Field
            name="participantId"
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Participant
                </label>
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                >
                  <option value="">All</option>
                  {events?.map((event) => (
                    <option
                      key={event.participantId}
                      value={event.participantId}
                    >
                      {event.participantName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          />

          <div className="flex space-x-2">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "..." : "Generate Report"}
                </Button>
              )}
            />
            <Button type="button" variant="outline">
              Export
            </Button>
            <Button type="button" variant="outline">
              Save Configuration
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}

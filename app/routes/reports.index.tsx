import React from "react";
import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Panel } from "@/components/ui/panel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { queryClient } from "@/query/client";
import { useGenerateReportMutation } from "@/query/mutations/reports";
import { eventTypesListOptions } from "@/query/options/event-types";
import { facilitiesListOptions } from "@/query/options/facilities";

const reportFormSchema = z.object({
  report: z.object({
    reportType: z.enum([
      "facility_usage",
      "event_participation",
      "visitor_frequency",
    ]),
    dateRange: z.string().min(1, "Date range is required"),
    filters: z.object({
      facilityId: z.string().optional(),
      eventTypeId: z.string().optional(),
      visitorId: z.string().optional(),
    }),
    grouping: z.enum(["week", "month", "facility_type"]).optional(),
  }),
});

export const Route = createFileRoute("/reports/")({
  component: ReportsPageComponent,
  loader: (opts) => {
    return Promise.all([
      opts.context.queryClient.ensureQueryData(
        facilitiesListOptions({
          page: 1,
          pageSize: 100,
        })
      ),
      opts.context.queryClient.ensureQueryData(
        eventTypesListOptions({
          page: 1,
          pageSize: 100,
        })
      ),
    ]);
  },
});

function ReportsPageComponent() {
  const { data: facilities } = useSuspenseQuery(
    facilitiesListOptions({
      page: 1,
      pageSize: 100,
    })
  );
  const { data: eventTypes } = useSuspenseQuery(
    eventTypesListOptions({
      page: 1,
      pageSize: 100,
    })
  );

  const generateReportMutation = useGenerateReportMutation();

  const form = useForm({
    defaultValues: {
      report: {
        reportType: "facility_usage",
        dateRange: "",
        filters: {
          facilityId: undefined,
          eventTypeId: undefined,
          visitorId: undefined,
        },
        grouping: undefined,
      },
    } as z.infer<typeof reportFormSchema>,
    onSubmit: async ({ value }) => {
      await generateReportMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    validatorAdapter: zodValidator(),
  });

  const handleDateRangeChange = (range: { start: Date; end: Date }) => {
    form.setFieldValue(
      "report.dateRange",
      `${range.start.toISOString()},${range.end.toISOString()}`
    );
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Reports</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="report.reportType"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Report Type
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facility_usage">
                      Facility Usage
                    </SelectItem>
                    <SelectItem value="event_participation">
                      Event Participation
                    </SelectItem>
                    <SelectItem value="visitor_frequency">
                      Visitor Frequency
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <form.Field
            name="report.dateRange"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Date Range
                </label>
                <DateRangePicker onChange={handleDateRangeChange} />
              </div>
            )}
          />

          <form.Field
            name="report.filters.facilityId"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Facility
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select facility" />
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
            name="report.filters.eventTypeId"
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
                  onValueChange={(value) => field.handleChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes?.map((eventType) => (
                      <SelectItem
                        key={eventType.eventTypeId}
                        value={eventType.eventTypeId}
                      >
                        {eventType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <form.Field
            name="report.grouping"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Grouping
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grouping" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="facility_type">Facility Type</SelectItem>
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
                  {isSubmitting ? "..." : "Generate Report"}
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
    </div>
  );
}

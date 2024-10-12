import React from "react";
import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Panel } from "@/components/ui/panel";
import { reportTypeSelect } from "@/components/ui/report-type-select";
import { useGenerateMaintenanceReportMutation } from "@/query/mutations/reports";
import { maintenanceReportOptions } from "@/query/options/maintenance-reports";

export const Route = createFileRoute("/maintenance/reports/")({
  component: MaintenanceReportsPageComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      maintenanceReportOptions({
        page: 1,
        pageSize: 100,
      })
    );
  },
});

const reportFormSchema = z.object({
  report: z.object({
    dateRange: z.string().min(1, "Date range is required"),
    reportType: z.string().min(1, "Report type is required"),
    stallId: z.string().optional(),
  }),
});

function MaintenanceReportsPageComponent() {
  const { data: reportTypes } = useSuspenseQuery(
    maintenanceReportOptions({
      page: 1,
      pageSize: 100,
    })
  );
  const generateReportMutation = useGenerateMaintenanceReportMutation();
  const form = useForm({
    defaultValues: {
      report: {
        dateRange: "",
        reportType: "",
        stallId: "",
      },
    } as z.infer<typeof reportFormSchema>,
    onSubmit: async ({ value }) => {
      await generateReportMutation.mutateAsync(value);
    },
    validatorAdapter: zodValidator(),
  });

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Maintenance Reports</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
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
                <DateRangePicker
                  id={field.name}
                  value={field.state.value}
                  onChange={(range) =>
                    field.handleChange(
                      `${range.startDate.toISOString()} - ${range.endDate.toISOString()}`
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
            name="report.reportType"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Report Type
                </label>
                <reportTypeSelect
                  id={field.name}
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  {reportTypes?.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </reportTypeSelect>
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-2 text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          />

          <form.Field
            name="report.stallId"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Stall
                </label>
                <select
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                >
                  <option value="">Select a stall</option>
                  {/* Map through stalls to create options */}
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

import React from "react";
import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Panel } from "@/components/ui/panel";
import { useGenerateReportMutation } from "@/query/mutations/reports";
import { reportTypesOptions } from "@/query/options/report-types";

export const Route = createFileRoute("/billing/reports/")({
  component: BillingReportsPageComponent,
});

const reportFormSchema = z.object({
  report: z.object({
    reportType: z.string().min(1, "Report type is required"),
    dateRange: z.array(z.number()).length(2, "Date range is required"),
    filters: z.record(z.string()).optional(),
  }),
});

function BillingReportsPageComponent() {
  const generateReportMutation = useGenerateReportMutation();
  const form = useForm({
    defaultValues: {
      report: {
        reportType: "",
        dateRange: [],
        filters: {},
      },
    } as z.infer<typeof reportFormSchema>,
    onSubmit: async ({ value }) => {
      await generateReportMutation.mutateAsync(value);
    },
    validatorAdapter: zodValidator(),
  });

  const { data: reportTypes } = useSuspenseQuery(
    reportTypesOptions({
      page: 1,
      pageSize: 100,
    })
  );

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Billing Reports</h1>
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
                <select
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select report type</option>
                  {reportTypes?.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-2 text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
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
                <DateRangePicker
                  value={field.state.value}
                  onChange={(range) => field.handleChange(range)}
                />
              </div>
            )}
          />

          <div className="flex space-x-2">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "Generating..." : "Generate Report"}
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
        <h2 className="text-xl font-bold">Report Preview</h2>
        {/* Placeholder for report preview section */}
        <div className="mt-4">
          <p>Preview of the generated report will be displayed here.</p>
        </div>
      </Panel>
    </div>
  );
}

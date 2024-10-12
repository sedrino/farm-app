import React from "react";
import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Panel } from "@/components/ui/panel";
import { ReportTypeSelect } from "@/components/ui/report-type-select";
import { queryClient } from "@/query/client";
import { useGenerateReportMutation } from "@/query/mutations/reports";
import { savedReportsListOptions } from "@/query/options/reports";

export const Route = createFileRoute("/financial-reports/")({
  component: FinancialReportsPageComponent,
});

const reportFormSchema = z.object({
  report: z.object({
    reportType: z.string().min(1, "Report type is required"),
    dateRange: z.array(z.date()).length(2, "Date range is required"),
    category: z.string().optional(),
    source: z.string().optional(),
  }),
});

function FinancialReportsPageComponent() {
  const navigate = Route.useNavigate();
  const generateReportMutation = useGenerateReportMutation();
  const { data: savedReports } = useSuspenseQuery(
    savedReportsListOptions({
      page: 1,
      pageSize: 100,
    })
  );

  const form = useForm({
    defaultValues: {
      report: {
        reportType: "",
        dateRange: [new Date(), new Date()],
        category: "",
        source: "",
      },
    } as z.infer<typeof reportFormSchema>,
    onSubmit: async ({ value }) => {
      await generateReportMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    validatorAdapter: zodValidator(),
  });

  const handleCancel = () => {
    navigate({
      to: "/",
    });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Financial Reports</h1>
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
                <ReportTypeSelect
                  id={field.name}
                  value={field.state.value}
                  onValueChange={field.handleChange}
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
                  onChange={(value) => field.handleChange(value)}
                />
              </div>
            )}
          />

          <form.Field
            name="report.category"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <input
                  id={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
              </div>
            )}
          />

          <form.Field
            name="report.source"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Source
                </label>
                <input
                  id={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
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
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Panel>

      <Panel className="p-4">
        <h2 className="text-xl font-bold">Saved Reports</h2>
        <ul className="mt-4">
          {savedReports?.map((report) => (
            <li key={report.savedReportId}>
              <a
                href={report.fileUrl}
                className="text-blue-600 hover:underline"
              >
                {report.reportName}
              </a>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

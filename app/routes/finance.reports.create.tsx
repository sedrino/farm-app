import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useCreateReportMutation } from "@/query/mutations/reports";
import { dataPointsListOptions } from "@/query/options/data-points";

export const Route = createFileRoute("/finance/reports/create")({
  component: CreateReportComponent,
});

const reportFormSchema = z.object({
  report: z.object({
    reportName: z.string().min(1, "Report name is required"),
    reportType: z.string().min(1, "Report type is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  }),
  dataPoints: z.array(z.string()).default([]).optional(),
  groupingOptions: z.array(z.string()).default([]).optional(),
  summaryOptions: z.array(z.string()).default([]).optional(),
  isScheduled: z.boolean().default(false),
  scheduleFrequency: z.string().optional(),
});

function CreateReportComponent() {
  const navigate = Route.useNavigate();
  const createReportMutation = useCreateReportMutation();
  const { data: dataPoints } = useSuspenseQuery(
    dataPointsListOptions({
      page: 1,
      pageSize: 100,
    })
  );

  const form = useForm({
    defaultValues: {
      report: {
        reportName: "",
        reportType: "",
        startDate: "",
        endDate: "",
      },
      dataPoints: [],
      groupingOptions: [],
      summaryOptions: [],
      isScheduled: false,
      scheduleFrequency: undefined,
    } as z.infer<typeof reportFormSchema>,
    onSubmit: async ({ value }) => {
      await createReportMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      navigate({ to: "/finance/reports" });
    },
    validatorAdapter: zodValidator(),
  });

  const handleCancel = () => {
    navigate({ to: "/finance/reports" });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">
          Create Custom Financial Report
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="report.reportName"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Report Name
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
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income Report</SelectItem>
                    <SelectItem value="expense">Expense Report</SelectItem>
                    <SelectItem value="financial">Financial Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <form.Field
            name="report.startDate"
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
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          />

          <form.Field
            name="report.endDate"
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
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data Points
            </label>
            <form.Field name="dataPoints" mode="array">
              {(field) => (
                <div>
                  <Select onValueChange={(value) => field.pushValue(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data points" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataPoints?.map((dataPoint) => (
                        <SelectItem key={dataPoint.id} value={dataPoint.name}>
                          {dataPoint.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-2">
                    {field.state.value?.map((dataPoint, index) => (
                      <span
                        key={index}
                        className="mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
                      >
                        {dataPoint}
                        <button
                          type="button"
                          onClick={() =>
                            form.setFieldValue("dataPoints", (prev) =>
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
              Grouping Options
            </label>
            <form.Field name="groupingOptions" mode="array">
              {(field) => (
                <div>
                  <Select onValueChange={(value) => field.pushValue(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grouping options" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="type">Type</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-2">
                    {field.state.value?.map((option, index) => (
                      <span
                        key={index}
                        className="mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
                      >
                        {option}
                        <button
                          type="button"
                          onClick={() =>
                            form.setFieldValue("groupingOptions", (prev) =>
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
              Summary Options
            </label>
            <form.Field name="summaryOptions" mode="array">
              {(field) => (
                <div>
                  <Select onValueChange={(value) => field.pushValue(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select summary options" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="total">Total</SelectItem>
                      <SelectItem value="average">Average</SelectItem>
                      <SelectItem value="count">Count</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-2">
                    {field.state.value?.map((option, index) => (
                      <span
                        key={index}
                        className="mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
                      >
                        {option}
                        <button
                          type="button"
                          onClick={() =>
                            form.setFieldValue("summaryOptions", (prev) =>
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
            name="report.notes"
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

          <form.Field
            name="report.isScheduled"
            children={(field) => (
              <div className="flex items-center">
                <Checkbox
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) =>
                    field.handleChange(checked === true)
                  }
                />
                <label
                  htmlFor={field.name}
                  className="ml-2 text-sm text-gray-700"
                >
                  Schedule Report
                </label>
              </div>
            )}
          />

          {form.getFieldValue("report.isScheduled") && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Schedule Frequency
              </label>
              <form.Field name="scheduleFrequency">
                {(field) => (
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </form.Field>
            </div>
          )}

          <div className="flex space-x-2">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "..." : "Save Report"}
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

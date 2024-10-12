import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useDeleteExerciseReportMutation } from "@/query/mutations/exercise-reports";
import { exerciseReportsListOptions } from "@/query/options/exercise-reports";

const exerciseReportsSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["date", "horse", "type"]).catch("date"),
});

export const Route = createFileRoute("/horses/exercise-reports/")({
  component: ExerciseReportsPageComponent,
  validateSearch: zodSearchValidator(exerciseReportsSearchSchema),
  loaderDeps: ({ search: { page, pageSize, search, sort } }) => ({
    page,
    pageSize,
    search,
    sort,
  }),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      exerciseReportsListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
      })
    );
  },
});

function ExerciseReportsPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    exerciseReportsListOptions({
      page: search.page,
      pageSize: search.pageSize,
    })
  );

  const columnHelper = React.useMemo(
    () => createColumnHelper<(typeof data)[0]>(),
    []
  );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("reportName", {
        header: "Report Name",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link
              to={"/exercise-reports/$reportId/edit"}
              params={{ reportId: info.row.original.reportId }}
            >
              {info.getValue()}
            </Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("horseId", {
        header: "Horse",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("startDate", {
        header: "Start Date",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("endDate", {
        header: "End Date",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("reportType", {
        header: "Report Type",
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={"/exercise-reports/$reportId/edit"}
                params={{
                  reportId: info.row.original.reportId,
                }}
              >
                Edit
              </Link>
            </Button>
            <DeleteExerciseReportButton reportId={info.row.original.reportId} />
          </div>
        ),
      }),
    ],
    [columnHelper]
  );

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <Button variant="default" asChild>
            <Link to={"/exercise-reports/create"}>Create New Report</Link>
          </Button>
        </div>
        <BasicTable
          columns={columns}
          data={data}
          caption="List of exercise reports."
        />
      </Panel>
    </div>
  );
}

function DeleteExerciseReportButton({ reportId }: { reportId: string }) {
  const deleteExerciseReportMutation =
    useDeleteExerciseReportMutation(reportId);
  return (
    <Button
      variant="destructive"
      onClick={() => deleteExerciseReportMutation.mutate()}
    >
      Delete
    </Button>
  );
}
import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useDeleteReportMutation } from "@/query/mutations/reports";
import { reportsListOptions } from "@/query/options/reports";

const reportsSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["date", "type"]).catch("date"),
});

export const Route = createFileRoute("/farm-operations/inventory/reports/")({
  component: ReportsPageComponent,
  validateSearch: zodSearchValidator(reportsSearchSchema),
  loaderDeps: ({ search: { page, pageSize, search, sort } }) => ({
    page,
    pageSize,
    search,
    sort,
  }),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      reportsListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
      })
    );
  },
});

function ReportsPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    reportsListOptions({
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
              to={"/reports/$reportId/edit"}
              params={{ reportId: info.row.original.reportId }}
            >
              {info.getValue()}
            </Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("reportType", {
        header: "Report Type",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("generatedAt", {
        header: "Generated At",
        cell: (info) => new Date(info.getValue()).toLocaleString(),
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={"/reports/$reportId/edit"}
                params={{
                  reportId: info.row.original.reportId,
                }}
              >
                Edit
              </Link>
            </Button>
            <DeleteReportButton reportId={info.row.original.reportId} />
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
            <Link to={"/reports/create"}>Generate New Report</Link>
          </Button>
        </div>
        <BasicTable columns={columns} data={data} caption="List of reports." />
      </Panel>
    </div>
  );
}

function DeleteReportButton({ reportId }: { reportId: string }) {
  const deleteReportMutation = useDeleteReportMutation(reportId);
  return (
    <Button variant="destructive" onClick={() => deleteReportMutation.mutate()}>
      Delete
    </Button>
  );
}
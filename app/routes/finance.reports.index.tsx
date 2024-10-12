import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { useDeleteReportMutation } from "@/query/mutations/reports";
import { reportsListOptions } from "@/query/options/reports";

const reportsSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["date", "type"]).catch("date"),
});

export const Route = createFileRoute("/finance/reports/")({
  component: ReportsPageComponent,
  validateSearch: zodSearchValidator(reportsSearchSchema), // Updated to use zodSearchValidator
  loaderDeps: ({ search }) => search,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      reportsListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
        search: opts.deps.search,
        sort: opts.deps.sort,
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
      search: search.search,
      sort: search.sort,
    })
  );

  const columnHelper = React.useMemo(
    () => createColumnHelper<(typeof data)[0]>(),
    []
  );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("reportType", {
        header: "Report Type",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link to={`/finance/reports/${info.row.original.reportId}`}>
              {info.getValue()}
            </Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("dateRange", {
        header: "Date Range",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("generatedAt", {
        header: "Generated At",
        cell: (info) => formatDate(info.getValue()),
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link to={`/finance/reports/${info.row.original.reportId}/edit`}>
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
            <Link to="/finance/reports/create">Create New Report</Link>
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
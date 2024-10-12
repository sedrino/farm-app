import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { useDeleteIncomeMutation } from "@/query/mutations/incomes";
import { incomesListOptions } from "@/query/options/incomes";

const incomesSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  dateRange: z.string().optional(),
  category: z.string().optional(),
  source: z.string().optional(),
});

export const Route = createFileRoute("/income/")({
  component: IncomePageComponent,
  validateSearch: zodSearchValidator(incomesSearchSchema),
  loaderDeps: ({ search }) => search,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      incomesListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
        dateRange: opts.deps.dateRange,
        category: opts.deps.category,
        source: opts.deps.source,
      })
    );
  },
});

function IncomePageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    incomesListOptions({
      page: search.page,
      pageSize: search.pageSize,
      dateRange: search.dateRange,
      category: search.category,
      source: search.source,
    })
  );

  const columnHelper = React.useMemo(
    () => createColumnHelper<(typeof data)[0]>(),
    []
  );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("date", {
        header: "Date",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("category", {
        header: "Category",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("source", {
        header: "Source",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={`/income/${info.row.original.incomeId}/edit`}
                params={{ incomeId: info.row.original.incomeId }}
              >
                Edit
              </Link>
            </Button>
            <DeleteIncomeButton incomeId={info.row.original.incomeId} />
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
          <Input placeholder="Search income..." />
          <Button variant="default" asChild>
            <Link to="/income/create">New Income Entry</Link>
          </Button>
        </div>
        <BasicTable columns={columns} data={data} caption="List of income." />
      </Panel>
    </div>
  );
}

function DeleteIncomeButton({ incomeId }: { incomeId: string }) {
  const deleteIncomeMutation = useDeleteIncomeMutation(incomeId);
  return (
    <Button variant="destructive" onClick={() => deleteIncomeMutation.mutate()}>
      Delete
    </Button>
  );
}
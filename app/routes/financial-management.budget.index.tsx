import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useDeleteBudgetMutation } from "@/query/mutations/budgets";
import { budgetsListOptions } from "@/query/options/budgets";

const budgetsSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
});

export const Route = createFileRoute("/financial-management/budget/")({
  component: BudgetsPageComponent,
  validateSearch: zodSearchValidator(budgetsSearchSchema),
  loaderDeps: ({ search: { page, pageSize } }) => ({ page, pageSize }),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      budgetsListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
      })
    );
  },
});

function BudgetsPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    budgetsListOptions({
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
      columnHelper.accessor("year", {
        header: "Year",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("totalAmount", {
        header: "Total Amount",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={"/financial-management/budget/$budgetId/edit"}
                params={{
                  budgetId: info.row.original.budgetId,
                }}
              >
                Edit
              </Link>
            </Button>
            <DeleteBudgetButton budgetId={info.row.original.budgetId} />
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
            <Link to={"/financial-management/budget/create"}>
              Create New Budget
            </Link>
          </Button>
        </div>
        <BasicTable columns={columns} data={data} caption="List of budgets." />
      </Panel>
    </div>
  );
}

function DeleteBudgetButton({ budgetId }: { budgetId: string }) {
  const deleteBudgetMutation = useDeleteBudgetMutation(budgetId);
  return (
    <Button variant="destructive" onClick={() => deleteBudgetMutation.mutate()}>
      Delete
    </Button>
  );
}
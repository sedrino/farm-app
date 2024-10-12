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
import { useDeleteExpenseMutation } from "@/query/mutations/expenses";
import { expensesListOptions } from "@/query/options/expenses";

const expensesSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  dateRange: z.string().optional(),
  category: z.string().optional(),
  vendor: z.string().optional(),
});

export const Route = createFileRoute("/financial-management/expenses/")({
  component: ExpensesPageComponent,
  validateSearch: zodSearchValidator(expensesSearchSchema),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      expensesListOptions({
        page: opts.search.page,
        pageSize: opts.search.pageSize,
        dateRange: opts.search.dateRange,
        category: opts.search.category,
        vendor: opts.search.vendor,
      })
    );
  },
});

function ExpensesPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    expensesListOptions({
      page: search.page,
      pageSize: search.pageSize,
      dateRange: search.dateRange,
      category: search.category,
      vendor: search.vendor,
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
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("vendor", {
        header: "Vendor",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={`/financial-management/expenses/${info.row.original.expenseId}/edit`}
              >
                Edit
              </Link>
            </Button>
            <DeleteExpenseButton expenseId={info.row.original.expenseId} />
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
          <Input placeholder="Search expenses..." />
          <Button variant="default" asChild>
            <Link to="/financial-management/expenses/create">
              Create New Expense Entry
            </Link>
          </Button>
        </div>
        <BasicTable columns={columns} data={data} caption="List of expenses." />
        <div className="mt-4">
          <h2 className="text-xl font-bold">Summary</h2>
          <p>Total Expenses: {/* Calculate and display total expenses */}</p>
        </div>
      </Panel>
    </div>
  );
}

function DeleteExpenseButton({ expenseId }: { expenseId: string }) {
  const deleteExpenseMutation = useDeleteExpenseMutation(expenseId);
  return (
    <Button
      variant="destructive"
      onClick={() => deleteExpenseMutation.mutate()}
    >
      Delete
    </Button>
  );
}
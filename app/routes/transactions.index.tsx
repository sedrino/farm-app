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
import { useDeleteTransactionMutation } from "@/query/mutations/transactions";
import { transactionsListOptions } from "@/query/options/transactions";

const transactionsSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  dateRange: z.string().optional(),
  transactionType: z.enum(["income", "expense"]).optional(),
  category: z.string().optional(),
  amount: z.number().optional(),
});

export const Route = createFileRoute("/transactions/")({
  component: TransactionsPageComponent,
  validateSearch: zodSearchValidator(transactionsSearchSchema),
  loaderDeps: ({ search }) => search,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      transactionsListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
        dateRange: opts.deps.dateRange,
        transactionType: opts.deps.transactionType,
        category: opts.deps.category,
        amount: opts.deps.amount,
      })
    );
  },
});

function TransactionsPageComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    transactionsListOptions({
      page: search.page,
      pageSize: search.pageSize,
      dateRange: search.dateRange,
      transactionType: search.transactionType,
      category: search.category,
      amount: search.amount,
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
        cell: (info) => formatDate(info.getValue()),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("type", {
        header: "Type",
        cell: (info) => (
          <span
            className={
              info.getValue() === "income" ? "text-green-500" : "text-red-500"
            }
          >
            {info.getValue()}
          </span>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("category", {
        header: "Category",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) => `$${info.getValue().toFixed(2)}`,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: (info) => (
          <Button variant="link" asChild>
            <Link to={`/transactions/${info.row.original.transactionId}`}>
              {info.getValue()}
            </Link>
          </Button>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button asChild>
              <Link
                to={`/transactions/${info.row.original.transactionId}/edit`}
              >
                Edit
              </Link>
            </Button>
            <DeleteTransactionButton
              transactionId={info.row.original.transactionId}
            />
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
            <Link to="/transactions/create">Add New Transaction</Link>
          </Button>
          {/* Add filters here */}
        </div>
        <BasicTable
          columns={columns}
          data={data}
          caption="List of transactions."
        />
        <div className="mt-4">
          <h2 className="text-xl font-bold">Summary</h2>
          <p>Total Income: ${data.totalIncome}</p>
          <p>Total Expenses: ${data.totalExpenses}</p>
          <p>Net Amount: ${data.netAmount}</p>
        </div>
      </Panel>
    </div>
  );
}

function DeleteTransactionButton({ transactionId }: { transactionId: string }) {
  const deleteTransactionMutation = useDeleteTransactionMutation(transactionId);
  return (
    <Button
      variant="destructive"
      onClick={() => deleteTransactionMutation.mutate()}
    >
      Delete
    </Button>
  );
}
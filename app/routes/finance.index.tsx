import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { expenseListOptions } from "@/query/options/expenses";
import { incomeListOptions } from "@/query/options/incomes";
import { transactionsListOptions } from "@/query/options/transactions";

const financeSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["date", "amount"]).catch("date"),
});

export const Route = createFileRoute("/finance/")({
  component: FinanceDashboardComponent,
  validateSearch: zodSearchValidator(financeSearchSchema),
  loaderDeps: ({ search: { page, pageSize, search, sort } }) => ({
    page,
    pageSize,
    search,
    sort,
  }),
  loader: (opts) => {
    return Promise.all([
      opts.context.queryClient.ensureQueryData(
        incomeListOptions({
          page: opts.deps.page,
          pageSize: opts.deps.pageSize,
        })
      ),
      opts.context.queryClient.ensureQueryData(
        expenseListOptions({
          page: opts.deps.page,
          pageSize: opts.deps.pageSize,
        })
      ),
      opts.context.queryClient.ensureQueryData(
        transactionsListOptions({
          page: opts.deps.page,
          pageSize: opts.deps.pageSize,
        })
      ),
    ]);
  },
});

function FinanceDashboardComponent() {
  const search = Route.useSearch();
  const { data: incomes } = useSuspenseQuery(
    incomeListOptions({
      page: search.page,
      pageSize: search.pageSize,
    })
  );
  const { data: expenses } = useSuspenseQuery(
    expenseListOptions({
      page: search.page,
      pageSize: search.pageSize,
    })
  );
  const { data: transactions } = useSuspenseQuery(
    transactionsListOptions({
      page: search.page,
      pageSize: search.pageSize,
    })
  );

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="text-2xl font-bold">Finance Dashboard</h1>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-4 shadow">
            <h2 className="text-xl font-semibold">Total Income</h2>
            <p className="text-2xl">${incomes.totalAmount}</p>
            <p className="text-sm text-gray-600">
              Month: ${incomes.monthlyAmount}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <h2 className="text-xl font-semibold">Total Expenses</h2>
            <p className="text-2xl">${expenses.totalAmount}</p>
            <p className="text-sm text-gray-600">
              Month: ${expenses.monthlyAmount}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <ul>
              {transactions.map((transaction) => (
                <li key={transaction.transactionId}>
                  {formatDate(transaction.date)} - ${transaction.amount}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Panel>
      <Panel className="p-4">
        <h2 className="text-xl font-bold">Income vs Expenses</h2>
        {/* Chart component goes here */}
      </Panel>
      <Panel className="p-4">
        <h2 className="text-xl font-bold">Alerts</h2>
        {/* Alerts section goes here */}
      </Panel>
    </div>
  );
}

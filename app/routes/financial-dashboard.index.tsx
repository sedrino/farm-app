import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, zodSearchValidator } from "@tanstack/react-router";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { expenseListOptions } from "@/query/options/expenses";
import { incomeListOptions } from "@/query/options/incomes";
import { transactionsListOptions } from "@/query/options/transactions";

const financialDashboardSearchSchema = z.object({
  month: z.coerce
    .number()
    .min(1)
    .max(12)
    .catch(new Date().getMonth() + 1),
  year: z.coerce.number().min(2000).catch(new Date().getFullYear()),
});

export const Route = createFileRoute("/financial-dashboard/")({
  component: FinancialDashboardComponent,
  validateSearch: zodSearchValidator(financialDashboardSearchSchema),
  loaderDeps: ({ search: { month, year } }) => ({ month, year }),
  loader: (opts) => {
    return Promise.all([
      opts.context.queryClient.ensureQueryData(
        incomeListOptions({
          month: opts.deps.month,
          year: opts.deps.year,
        })
      ),
      opts.context.queryClient.ensureQueryData(
        expenseListOptions({
          month: opts.deps.month,
          year: opts.deps.year,
        })
      ),
      opts.context.queryClient.ensureQueryData(
        transactionsListOptions({
          month: opts.deps.month,
          year: opts.deps.year,
        })
      ),
    ]);
  },
});

function FinancialDashboardComponent() {
  const search = Route.useSearch();
  const { data: incomes } = useSuspenseQuery(
    incomeListOptions({
      month: search.month,
      year: search.year,
    })
  );
  const { data: expenses } = useSuspenseQuery(
    expenseListOptions({
      month: search.month,
      year: search.year,
    })
  );
  const { data: transactions } = useSuspenseQuery(
    transactionsListOptions({
      month: search.month,
      year: search.year,
    })
  );

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const netProfit = totalIncome - totalExpenses;

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="text-2xl font-bold">Financial Dashboard</h1>
        <div className="mt-4 flex space-x-4">
          <div className="flex-1 rounded-lg bg-white p-4 shadow">
            <h2 className="text-xl font-semibold">Income</h2>
            <p className="text-2xl">${totalIncome.toFixed(2)}</p>
            <Button
              variant="link"
              className="mt-2"
              onClick={() => {
                /* Navigate to add income */
              }}
            >
              Add Income
            </Button>
          </div>
          <div className="flex-1 rounded-lg bg-white p-4 shadow">
            <h2 className="text-xl font-semibold">Expenses</h2>
            <p className="text-2xl">${totalExpenses.toFixed(2)}</p>
            <Button
              variant="link"
              className="mt-2"
              onClick={() => {
                /* Navigate to add expense */
              }}
            >
              Add Expense
            </Button>
          </div>
          <div className="flex-1 rounded-lg bg-white p-4 shadow">
            <h2 className="text-xl font-semibold">Net Profit/Loss</h2>
            <p className="text-2xl">${netProfit.toFixed(2)}</p>
          </div>
        </div>
      </Panel>

      <Panel className="p-4">
        <h2 className="text-xl font-bold">Recent Transactions</h2>
        <ul className="mt-2 space-y-2">
          {transactions.map((transaction) => (
            <li
              key={transaction.transactionId}
              className="flex justify-between"
            >
              <span>{transaction.description}</span>
              <span>${transaction.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel className="p-4">
        <h2 className="text-xl font-bold">Income vs Expenses</h2>
        {/* Chart component goes here */}
      </Panel>

      <Panel className="p-4">
        <h2 className="text-xl font-bold">Quick Links</h2>
        <ul className="mt-2 space-y-2">
          <li>
            <Button
              variant="link"
              onClick={() => {
                /* Navigate to add income */
              }}
            >
              Add Income
            </Button>
          </li>
          <li>
            <Button
              variant="link"
              onClick={() => {
                /* Navigate to add expense */
              }}
            >
              Add Expense
            </Button>
          </li>
          <li>
            <Button
              variant="link"
              onClick={() => {
                /* Navigate to reports */
              }}
            >
              View Reports
            </Button>
          </li>
          <li>
            <Button
              variant="link"
              onClick={() => {
                /* Navigate to budgets */
              }}
            >
              Manage Budgets
            </Button>
          </li>
        </ul>
      </Panel>

      <Panel className="p-4">
        <h2 className="text-xl font-bold">Alerts</h2>
        <ul className="mt-2 space-y-2">
          {/* List alerts for upcoming bills or overdue payments */}
        </ul>
      </Panel>
    </div>
  );
}
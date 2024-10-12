import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { expenseListOptions } from "@/query/options/expenses";
import { incomeListOptions } from "@/query/options/incomes";

export const Route = createFileRoute("/financial-management/")({
  component: FinancialManagementDashboard,
  loader: (opts) => {
    return Promise.all([
      opts.context.queryClient.ensureQueryData(incomeListOptions({})),
      opts.context.queryClient.ensureQueryData(expenseListOptions({})),
    ]);
  },
});

function FinancialManagementDashboard() {
  const { data: incomes } = useSuspenseQuery(incomeListOptions({}));
  const { data: expenses } = useSuspenseQuery(expenseListOptions({}));

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const budgetStatus = totalIncome - totalExpenses;

  return (
    <div className="flex flex-col gap-4 p-8">
      <h1 className="text-2xl font-bold">Financial Management Dashboard</h1>
      <div className="flex space-x-4">
        <Panel className="flex-1 p-4">
          <h2 className="text-xl">Income Summary</h2>
          <p>Total Income: ${totalIncome.toFixed(2)}</p>
          <Button variant="default" asChild>
            <Link to="/income/create">Add New Income</Link>
          </Button>
        </Panel>
        <Panel className="flex-1 p-4">
          <h2 className="text-xl">Expense Summary</h2>
          <p>Total Expenses: ${totalExpenses.toFixed(2)}</p>
          <Button variant="default" asChild>
            <Link to="/expenses/create">Add New Expense</Link>
          </Button>
        </Panel>
        <Panel className="flex-1 p-4">
          <h2 className="text-xl">Budget Status</h2>
          <p>Current Month Budget: ${budgetStatus.toFixed(2)}</p>
          <Button variant="default" asChild>
            <Link to="/budget">View Budget</Link>
          </Button>
        </Panel>
      </div>
      <Panel className="p-4">
        <h2 className="text-xl">Income vs Expenses Over Time</h2>
        {/* Placeholder for graph component */}
        <div className="h-40 bg-gray-200">[Graph Placeholder]</div>
      </Panel>
      <Panel className="p-4">
        <h2 className="text-xl">Quick Actions</h2>
        <div className="flex space-x-4">
          <Button variant="default" asChild>
            <Link to="/income/create">Add Income</Link>
          </Button>
          <Button variant="default" asChild>
            <Link to="/expenses/create">Add Expense</Link>
          </Button>
          <Button variant="default" asChild>
            <Link to="/reports">View Reports</Link>
          </Button>
          <Button variant="default" asChild>
            <Link to="/budget">Budget Planning</Link>
          </Button>
        </div>
      </Panel>
    </div>
  );
}

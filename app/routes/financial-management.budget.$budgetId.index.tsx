import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { useUpdateBudgetMutation } from "@/query/mutations/budgets";
import { budgetOptions } from "@/query/options/budgets";
import { Budget } from "@/server/db/schema";

const budgetSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
});

export const Route = createFileRoute("/financial-management/budget/$budgetId/")({
  component: BudgetDetailsComponent,
  validateSearch: zodSearchValidator(budgetSearchSchema),
  loaderDeps: ({ search: { page, pageSize } }) => ({ page, pageSize }),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      budgetOptions({
        budgetId: opts.params.budgetId,
      })
    );
  },
});

function BudgetDetailsComponent() {
  const { budgetId } = Route.useParams();
  const { data: budget } = useSuspenseQuery(
    budgetOptions({
      budgetId,
    })
  );
  const updateBudgetMutation = useUpdateBudgetMutation(budgetId);

  const handleEditBudget = () => {
    // Logic to edit the budget
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Budget Details</h1>
        <p>
          <strong>Year:</strong> {budget.year}
        </p>
        <p>
          <strong>Total Amount:</strong> ${budget.totalAmount}
        </p>
        <h2 className="mt-4 text-xl font-semibold">Allocations by Category</h2>
        <ul>
          {budget.categories.map((category) => (
            <li key={category.name}>
              {category.name}: ${category.plannedAmount}
            </li>
          ))}
        </ul>
        <h2 className="mt-4 text-xl font-semibold">
          Monthly View of Planned Expenses
        </h2>
        <table className="mt-2 w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Month</th>
              <th className="px-4 py-2">Planned Amount</th>
            </tr>
          </thead>
          <tbody>
            {budget.categories.map((category) =>
              category.plannedAmountMonthly.map((monthlyAmount, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{getMonthName(index)}</td>
                  <td className="border px-4 py-2">${monthlyAmount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <h2 className="mt-4 text-xl font-semibold">
          Comparison of Actual Spending vs. Budgeted Amounts
        </h2>
        {/* Visualization or table for actual vs. budgeted amounts */}
        <div className="mt-2">
          <Button onClick={handleEditBudget}>Edit Budget</Button>
        </div>
      </Panel>
    </div>
  );
}

function getMonthName(monthIndex: number) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[monthIndex];
}
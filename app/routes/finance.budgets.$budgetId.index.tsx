import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/query/client";
import { useUpdateBudgetMutation } from "@/query/mutations/budgets";
import { budgetDetailsOptions } from "@/query/options/budgets";

const budgetSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
});

export const Route = createFileRoute("/finance/budgets/$budgetId/")({
  component: BudgetDetailsComponent,
  validateSearch: zodSearchValidator(budgetSearchSchema),
  loaderDeps: ({ search: { page, pageSize } }) => ({ page, pageSize }),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      budgetDetailsOptions({
        budgetId: opts.params.budgetId,
      })
    );
  },
});

function BudgetDetailsComponent() {
  const { budgetId } = Route.useParams();
  const { data } = useSuspenseQuery(
    budgetDetailsOptions({
      budgetId,
    })
  );
  const updateBudgetMutation = useUpdateBudgetMutation(budgetId);

  const handleUpdateBudget = () => {
    // Logic to update the budget
    updateBudgetMutation.mutate({
      // New budget data
    });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Budget Details</h1>
        <div className="mb-4 flex items-center justify-between">
          <Input placeholder="Search budgets..." />
          <Button variant="default" onClick={handleUpdateBudget}>
            Update Budget
          </Button>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Planned vs Actual Spending</h2>
          {/* Display planned vs actual spending chart or table */}
        </div>
        <div>
          <h2 className="text-xl font-semibold">Budget Utilization</h2>
          {/* Display progress bars or charts */}
        </div>
        <div>
          <h2 className="text-xl font-semibold">Notes/Justifications</h2>
          <Textarea placeholder="Add notes or justifications for budget changes" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">
            Comparison with Previous Period
          </h2>
          {/* Display comparison with previous period's budget */}
        </div>
      </Panel>
    </div>
  );
}

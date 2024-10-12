import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { queryClient } from "@/query/client";
import {
  useBudgetUpdateMutation,
  useExpenseCategoriesListOptions,
} from "@/query/mutations/budgets";
import { budgetOptions } from "@/query/options/budgets";

export const Route = createFileRoute(
  "/financial-management/budget/$budgetId/edit"
)({
  component: EditBudgetComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      budgetOptions({
        budgetId: opts.params.budgetId,
      })
    );
  },
});

const budgetFormSchema = z.object({
  budget: z.object({
    totalAmount: z.number().min(0, "Total amount must be at least 0"),
  }),
  allocations: z
    .record(z.string(), z.number().min(0, "Allocation must be at least 0"))
    .optional(),
});

function EditBudgetComponent() {
  const { budgetId } = Route.useParams();
  const { data: budget } = useSuspenseQuery(
    budgetOptions({
      budgetId,
    })
  );
  const { data: expenseCategories } = useSuspenseQuery(
    useExpenseCategoriesListOptions({
      budgetId,
    })
  );

  const updateBudgetMutation = useBudgetUpdateMutation(budgetId);

  const form = useForm({
    defaultValues: {
      budget: {
        totalAmount: budget.totalAmount,
      },
      allocations: budget.allocations,
    } as z.infer<typeof budgetFormSchema>,
    onSubmit: async ({ value }) => {
      await updateBudgetMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
    validatorAdapter: zodValidator(),
  });

  const handleCancel = () => {
    // Navigate back to the budget list or previous page
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Edit Budget</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="budget.totalAmount"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Total Amount
                </label>
                <Input
                  id={field.name}
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-2 text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Allocations
            </label>
            {expenseCategories.map((category) => (
              <form.Field
                key={category.id}
                name={`allocations.${category.id}`}
                children={(field) => (
                  <div className="mb-2 flex space-x-2">
                    <label
                      htmlFor={field.name}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {category.name}
                    </label>
                    <Input
                      id={field.name}
                      type="number"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="mt-2 text-sm text-red-600">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              />
            ))}
          </div>

          <div className="flex space-x-2">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "..." : "Save Changes"}
                </Button>
              )}
            />
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}

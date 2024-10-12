import React from "react";
import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/query/client";
import {
  useCreateBudgetMutation,
  useUpdateBudgetMutation,
} from "@/query/mutations/budgets";
import { budgetCategoriesListOptions } from "@/query/options/budget-categories";
import { budgetsListOptions } from "@/query/options/budgets";

export const Route = createFileRoute("/budget-planning/")({
  component: BudgetPlanningComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      budgetsListOptions({
        page: 1,
        pageSize: 100,
      })
    );
  },
});

const budgetFormSchema = z.object({
  budget: z.object({
    year: z.number().min(2020, "Year must be 2020 or later"),
    totalAmount: z.number().min(0, "Total amount must be at least 0"),
    status: z.enum(["draft", "approved", "finalized"]).default("draft"),
    isTemplate: z.boolean().default(false),
    name: z.string().min(1, "Name is required"),
  }),
  categories: z
    .array(
      z.object({
        categoryId: z.string().min(1, "Category is required"),
        plannedAmount: z.number().min(0, "Planned amount must be at least 0"),
        actualAmount: z.number().min(0, "Actual amount must be at least 0"),
      })
    )
    .min(1, "At least one category is required"),
});

function BudgetPlanningComponent() {
  const navigate = Route.useNavigate();
  const createBudgetMutation = useCreateBudgetMutation();
  const updateBudgetMutation = useUpdateBudgetMutation();
  const { data: budgets } = useSuspenseQuery(
    budgetsListOptions({
      page: 1,
      pageSize: 100,
    })
  );
  const { data: categories } = useSuspenseQuery(
    budgetCategoriesListOptions({
      page: 1,
      pageSize: 100,
    })
  );

  const form = useForm({
    defaultValues: {
      budget: {
        year: new Date().getFullYear(),
        totalAmount: 0,
        status: "draft",
        isTemplate: false,
        name: "",
      },
      categories: [],
    } as z.infer<typeof budgetFormSchema>,
    onSubmit: async ({ value }) => {
      if (value.budget.budgetId) {
        await updateBudgetMutation.mutateAsync(value);
      } else {
        await createBudgetMutation.mutateAsync(value);
      }
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      navigate({ to: "/budgets" });
    },
    validatorAdapter: zodValidator(),
  });

  const handleBudgetChange = (budgetId: string) => {
    // Load the selected budget details and update the form
    // This is a placeholder implementation
    const selectedBudget = budgets.find((b) => b.budgetId === budgetId);
    if (selectedBudget) {
      form.setFieldValue("budget", {
        year: selectedBudget.year,
        totalAmount: selectedBudget.totalAmount,
        status: selectedBudget.status,
        isTemplate: selectedBudget.isTemplate,
        name: selectedBudget.name,
      });
      form.setFieldValue(
        "categories",
        selectedBudget.categories.map((category) => ({
          categoryId: category.categoryId,
          plannedAmount: category.plannedAmount,
          actualAmount: category.actualAmount,
        }))
      );
    }
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Budget Planning</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="budget.name"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Budget Name
                </label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-2 text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          />

          <form.Field
            name="budget.year"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Year
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

          <form.Field
            name="budget.status"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="finalized">Finalized</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <form.Field
            name="categories"
            mode="array"
            children={(field) => (
              <div>
                {field.state.value?.map((_, index) => (
                  <div key={index} className="mb-2 flex space-x-2">
                    <form.Field
                      name={`categories[${index}].categoryId`}
                      children={(field) => (
                        <Select
                          value={field.state.value}
                          onValueChange={field.handleChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((category) => (
                              <SelectItem
                                key={category.categoryId}
                                value={category.categoryId}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <form.Field
                      name={`categories[${index}].plannedAmount`}
                      children={(field) => (
                        <Input
                          placeholder="Planned Amount"
                          type="number"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(Number(e.target.value))
                          }
                        />
                      )}
                    />
                    <form.Field
                      name={`categories[${index}].actualAmount`}
                      children={(field) => (
                        <Input
                          placeholder="Actual Amount"
                          type="number"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(Number(e.target.value))
                          }
                        />
                      )}
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        form.setFieldValue("categories", (prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                      variant="outline"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={() => field.pushValue({})}>
                  Add Category
                </Button>
              </div>
            )}
          />

          <div className="flex space-x-2">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "..." : "Save"}
                </Button>
              )}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/budgets" })}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}

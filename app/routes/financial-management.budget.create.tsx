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
import { useCreateBudgetMutation } from "@/query/mutations/budgets";
import { budgetCategoriesListOptions } from "@/query/options/budget-categories";

export const Route = createFileRoute("/financial-management/budget/create")({
  component: CreateBudgetComponent,
});

const budgetFormSchema = z.object({
  budget: z.object({
    year: z.number().min(2023, "Year must be 2023 or later"),
    totalAmount: z.number().min(0, "Total amount must be at least 0"),
  }),
  allocations: z.array(
    z.object({
      categoryId: z.string(),
      amount: z.number().min(0, "Amount must be at least 0"),
      monthlyAllocations: z
        .array(
          z.object({
            month: z.string(),
            amount: z.number().min(0, "Monthly amount must be at least 0"),
          })
        )
        .min(1, "At least one monthly allocation is required"),
    })
  ),
});

function CreateBudgetComponent() {
  const navigate = Route.useNavigate();
  const createBudgetMutation = useCreateBudgetMutation();
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
      },
      allocations:
        categories?.map((category) => ({
          categoryId: category.categoryId,
          amount: 0,
          monthlyAllocations: [
            { month: "January", amount: 0 },
            { month: "February", amount: 0 },
            { month: "March", amount: 0 },
            { month: "April", amount: 0 },
            { month: "May", amount: 0 },
            { month: "June", amount: 0 },
            { month: "July", amount: 0 },
            { month: "August", amount: 0 },
            { month: "September", amount: 0 },
            { month: "October", amount: 0 },
            { month: "November", amount: 0 },
            { month: "December", amount: 0 },
          ],
        })) ?? [],
    } as z.infer<typeof budgetFormSchema>,
    onSubmit: async ({ value }) => {
      await createBudgetMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      navigate({ to: "/financial-management/budgets" });
    },
    validatorAdapter: zodValidator(),
  });

  const handleCancel = () => {
    navigate({ to: "/financial-management/budgets" });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Create New Budget</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="budget.year"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Budget Year
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
                  Total Budget Amount
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
              Budget Allocations
            </label>
            {form.getFieldValue("allocations").map((allocation, index) => (
              <div key={index} className="mb-2">
                <form.Field
                  name={`allocations[${index}].categoryId`}
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
                  name={`allocations[${index}].amount`}
                  children={(field) => (
                    <Input
                      placeholder="Allocation Amount"
                      type="number"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                    />
                  )}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Monthly Allocations
                  </label>
                  {allocation.monthlyAllocations.map((monthly, monthIndex) => (
                    <div key={monthIndex} className="ml-4">
                      <form.Field
                        name={`allocations[${index}].monthlyAllocations[${monthIndex}].amount`}
                        children={(field) => (
                          <Input
                            placeholder={monthly.month}
                            type="number"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value))
                            }
                          />
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "..." : "Save Draft"}
                </Button>
              )}
            />
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
              }}
            >
              Finalize Budget
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}

import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/query/client";
import { useCreateBudgetMutation } from "@/query/mutations/budgets";
import { budgetCategoriesListOptions } from "@/query/options/budget-categories";

export const Route = createFileRoute("/finance/budgets/create")({
  component: CreateBudgetComponent,
});

const budgetFormSchema = z.object({
  budget: z.object({
    name: z.string().min(1, "Budget name is required"),
    year: z.number().min(2000, "Year must be 2000 or later"),
    totalAmount: z.number().min(0, "Total amount must be at least 0"),
    status: z.string().min(1, "Status is required"),
  }),
  categories: z
    .array(
      z.object({
        categoryId: z.string(),
        plannedAmount: z.number().min(0, "Planned amount must be at least 0"),
      })
    )
    .min(1, "At least one category is required"),
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
        name: "",
        year: new Date().getFullYear(),
        totalAmount: 0,
        status: "draft",
      },
      categories: [],
    } as z.infer<typeof budgetFormSchema>,
    onSubmit: async ({ value }) => {
      await createBudgetMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      navigate({ to: "/finance/budgets" });
    },
    validatorAdapter: zodValidator(),
  });

  const addCategory = () => {
    form.setFieldValue("categories", [
      ...form.getFieldValue("categories"),
      { categoryId: "", plannedAmount: 0 },
    ]);
  };

  const handleCancel = () => {
    navigate({ to: "/finance/budgets" });
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Categories
            </label>
            {form.getFieldValue("categories").map((_, index) => (
              <div key={index} className="mb-2 flex space-x-2">
                <form.Field
                  name={`categories[${index}].categoryId`}
                  children={(field) => (
                    <Input
                      placeholder="Category ID"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
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
            <Button type="button" onClick={addCategory} variant="outline">
              Add Category
            </Button>
          </div>

          <form.Field
            name="budget.notes"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Notes
                </label>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
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
              Save and Add Another
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}

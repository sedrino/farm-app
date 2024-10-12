import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useUpdateExpenseMutation } from "@/query/mutations/expenses";
import { expenseCategoriesListOptions } from "@/query/options/expense-categories";
import { expenseOptions } from "@/query/options/expenses";
import { tagsListOptions } from "@/query/options/tags";

export const Route = createFileRoute("/expenses/$expenseId/edit")({
  component: EditExpenseComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      expenseOptions({
        expenseId: opts.params.expenseId,
      })
    );
  },
});

const expenseFormSchema = z.object({
  expense: z.object({
    date: z.number().min(1, "Date is required"),
    amount: z.number().min(1, "Amount is required"),
    category: z.string().min(1, "Category is required"),
    vendor: z.string().min(1, "Vendor/Payee is required"),
    description: z.string().optional(),
    paymentMethod: z.string().min(1, "Payment method is required"),
  }),
  tags: z.array(z.string()).default([]).optional(),
});

function EditExpenseComponent() {
  const { expenseId } = Route.useParams();
  const { data: expenseData } = useSuspenseQuery(
    expenseOptions({
      expenseId,
    })
  );
  const { data: tags } = useSuspenseQuery(
    tagsListOptions({
      page: 1,
      pageSize: 100,
    })
  );
  const { data: categories } = useSuspenseQuery(
    expenseCategoriesListOptions({
      page: 1,
      pageSize: 100,
    })
  );

  const updateExpenseMutation = useUpdateExpenseMutation(expenseId);

  const form = useForm({
    defaultValues: {
      expense: {
        date: expenseData.date,
        amount: expenseData.amount,
        category: expenseData.category,
        vendor: expenseData.vendor,
        description: expenseData.description,
        paymentMethod: expenseData.paymentMethod,
      },
      tags: expenseData.tags || [],
    } as z.infer<typeof expenseFormSchema>,
    onSubmit: async ({ value }) => {
      await updateExpenseMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    validatorAdapter: zodValidator(),
  });

  const handleCancel = () => {
    // Redirect to the expense details page
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Edit Expense</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="expense.date"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Date of Expense
                </label>
                <Input
                  id={field.name}
                  type="date"
                  value={
                    new Date(field.state.value).toISOString().split("T")[0]
                  }
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(new Date(e.target.value).getTime())
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

          <form.Field
            name="expense.amount"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount
                </label>
                <Input
                  id={field.name}
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(parseFloat(e.target.value))
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

          <form.Field
            name="expense.category"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-2 text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          />

          <form.Field
            name="expense.vendor"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Vendor/Payee
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
            name="expense.description"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
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

          <form.Field
            name="expense.paymentMethod"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Payment Method
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-2 text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          />

          <form.Field
            name="tags"
            mode="array"
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <Select onValueChange={(value) => field.pushValue(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tags" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags?.map((tag) => (
                      <SelectItem key={tag.tagId} value={tag.name}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-2">
                  {field.state.value?.map((tag, index) => (
                    <span
                      key={index}
                      className="mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() =>
                          form.setFieldValue("tags", (prev) =>
                            prev?.filter((_, i) => i !== index)
                          )
                        }
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Receipt
            </label>
            <Input type="file" />
            <p className="mt-2 text-sm text-gray-500">
              Upload a new receipt or replace the existing one.
            </p>
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

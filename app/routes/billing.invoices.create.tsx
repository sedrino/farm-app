import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
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
import { useCreateInvoiceMutation } from "@/query/mutations/invoices";
import { boardersListOptions } from "@/query/options/boarders";

export const Route = createFileRoute("/billing/invoices/create")({
  component: CreateInvoiceComponent,
});

const invoiceFormSchema = z.object({
  invoice: z.object({
    boarderId: z.string().min(1, "Boarder is required"),
    invoiceDate: z.string().min(1, "Invoice date is required"),
    dueDate: z.string().min(1, "Due date is required"),
    notes: z.string().optional(),
  }),
  lineItems: z
    .array(
      z.object({
        description: z.string().min(1, "Description is required"),
        quantity: z.number().min(1, "Quantity is required"),
        unitPrice: z.number().min(0, "Unit price is required"),
      })
    )
    .min(1, "At least one line item is required"),
});

function CreateInvoiceComponent() {
  const navigate = Route.useNavigate();
  const createInvoiceMutation = useCreateInvoiceMutation();
  const { data: boarders } = useSuspenseQuery(
    boardersListOptions({
      page: 1,
      pageSize: 100,
    })
  );

  const form = useForm({
    defaultValues: {
      invoice: {
        boarderId: "",
        invoiceDate: "",
        dueDate: "",
        notes: "",
      },
      lineItems: [],
    } as z.infer<typeof invoiceFormSchema>,
    onSubmit: async ({ value }) => {
      await createInvoiceMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      navigate({ to: "/billing/invoices" });
    },
    validatorAdapter: zodValidator(),
  });

  const addLineItem = () => {
    form.setFieldValue("lineItems", [
      ...form.getFieldValue("lineItems"),
      { description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const calculateSubtotal = () => {
    return form
      .getFieldValue("lineItems")
      .reduce((total, item) => total + item.quantity * item.unitPrice, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxRate = 0.1; // Example tax rate of 10%
    const tax = subtotal * taxRate;
    return subtotal + tax;
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Create New Invoice</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="invoice.boarderId"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Boarder
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a boarder" />
                  </SelectTrigger>
                  <SelectContent>
                    {boarders?.map((boarder) => (
                      <SelectItem
                        key={boarder.boarderId}
                        value={boarder.boarderId}
                      >
                        {boarder.name}
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
            name="invoice.invoiceDate"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Invoice Date
                </label>
                <DatePicker
                  id={field.name}
                  selected={new Date(field.state.value)}
                  onChange={(date) =>
                    field.handleChange(date.toISOString().split("T")[0])
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
            name="invoice.dueDate"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Due Date
                </label>
                <DatePicker
                  id={field.name}
                  selected={new Date(field.state.value)}
                  onChange={(date) =>
                    field.handleChange(date.toISOString().split("T")[0])
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Line Items
            </label>
            {form.getFieldValue("lineItems").map((_, index) => (
              <div key={index} className="mb-2 flex space-x-2">
                <form.Field
                  name={`lineItems[${index}].description`}
                  children={(field) => (
                    <Input
                      placeholder="Description"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                />
                <form.Field
                  name={`lineItems[${index}].quantity`}
                  children={(field) => (
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                    />
                  )}
                />
                <form.Field
                  name={`lineItems[${index}].unitPrice`}
                  children={(field) => (
                    <Input
                      type="number"
                      placeholder="Unit Price"
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
                    form.setFieldValue("lineItems", (prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                  variant="outline"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" onClick={addLineItem} variant="outline">
              Add Line Item
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subtotal
            </label>
            <Input
              value={calculateSubtotal().toFixed(2)}
              readOnly
              placeholder="Subtotal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total
            </label>
            <Input
              value={calculateTotal().toFixed(2)}
              readOnly
              placeholder="Total"
            />
          </div>

          <form.Field
            name="invoice.notes"
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
                  {isSubmitting ? "..." : "Save and Send"}
                </Button>
              )}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
              }}
            >
              Save as Draft
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}

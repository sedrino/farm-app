import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/query/client";
import { useUpdateBillingConfigurationMutation } from "@/query/mutations/billing-configurations";

export const Route = createFileRoute("/billing/settings/")({
  component: BillingSettingsComponent,
});

const billingSettingsSchema = z.object({
  billingConfiguration: z.object({
    defaultPaymentTerms: z.string().optional(),
    taxRate: z.number().optional(),
    standardServiceRates: z
      .object({
        boarding: z.number().optional(),
        additionalServices: z.number().optional(),
      })
      .optional(),
    automaticBillingEnabled: z.boolean().optional(),
    acceptedPaymentMethods: z.array(z.string()).optional(),
    invoiceEmailTemplate: z.string().optional(),
    reminderEmailTemplate: z.string().optional(),
  }),
});

function BillingSettingsComponent() {
  const updateBillingConfigurationMutation =
    useUpdateBillingConfigurationMutation();
  const form = useForm({
    defaultValues: {
      billingConfiguration: {
        defaultPaymentTerms: "",
        taxRate: 0,
        standardServiceRates: {
          boarding: 0,
          additionalServices: 0,
        },
        automaticBillingEnabled: false,
        acceptedPaymentMethods: [],
        invoiceEmailTemplate: "",
        reminderEmailTemplate: "",
      },
    } as z.infer<typeof billingSettingsSchema>,
    onSubmit: async ({ value }) => {
      await updateBillingConfigurationMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["billing-configurations"] });
    },
    validatorAdapter: zodValidator(),
  });

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Billing Settings</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <div>
            <h2 className="text-xl font-semibold">Payment Terms</h2>
            <form.Field
              name="billingConfiguration.defaultPaymentTerms"
              children={(field) => (
                <Input
                  placeholder="Default Payment Terms"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold">Tax Rate</h2>
            <form.Field
              name="billingConfiguration.taxRate"
              children={(field) => (
                <Input
                  type="number"
                  placeholder="Tax Rate"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(parseFloat(e.target.value))
                  }
                />
              )}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold">Standard Service Rates</h2>
            <form.Field
              name="billingConfiguration.standardServiceRates.boarding"
              children={(field) => (
                <Input
                  type="number"
                  placeholder="Boarding Rate"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(parseFloat(e.target.value))
                  }
                />
              )}
            />
            <form.Field
              name="billingConfiguration.standardServiceRates.additionalServices"
              children={(field) => (
                <Input
                  type="number"
                  placeholder="Additional Services Rate"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(parseFloat(e.target.value))
                  }
                />
              )}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold">Automatic Billing</h2>
            <form.Field
              name="billingConfiguration.automaticBillingEnabled"
              children={(field) => (
                <Checkbox
                  checked={field.state.value}
                  onCheckedChange={(checked) =>
                    field.handleChange(checked === true)
                  }
                >
                  Enable Automatic Billing
                </Checkbox>
              )}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold">Accepted Payment Methods</h2>
            <form.Field
              name="billingConfiguration.acceptedPaymentMethods"
              children={(field) => (
                <Input
                  placeholder="Accepted Payment Methods (comma separated)"
                  value={field.state.value?.join(", ")}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value.split(", "))
                  }
                />
              )}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold">Invoice Email Template</h2>
            <form.Field
              name="billingConfiguration.invoiceEmailTemplate"
              children={(field) => (
                <Textarea
                  placeholder="Invoice Email Template"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold">Reminder Email Template</h2>
            <form.Field
              name="billingConfiguration.reminderEmailTemplate"
              children={(field) => (
                <Textarea
                  placeholder="Reminder Email Template"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />
          </div>

          <div className="flex space-x-2">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "..." : "Save"}
                </Button>
              )}
            />
          </div>
        </form>
      </Panel>
    </div>
  );
}

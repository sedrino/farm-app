import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/query/client";
import { useUpdateContractMutation } from "@/query/mutations/contracts";
import { contractOptions } from "@/query/options/contracts";

export const Route = createFileRoute("/contracts/$contractId/edit")({
  component: EditContractComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      contractOptions({
        contractId: opts.params.contractId,
      })
    );
  },
});

const contractFormSchema = z.object({
  contract: z.object({
    termsAndConditions: z.string().min(1, "Terms and conditions are required"),
    paymentTerms: z.string().min(1, "Payment terms are required"),
    status: z.string().min(1, "Status is required"),
  }),
});

function EditContractComponent() {
  const { contractId } = Route.useParams();
  const { data: contract } = useSuspenseQuery(
    contractOptions({
      contractId,
    })
  );
  const updateContractMutation = useUpdateContractMutation(contractId);

  const form = useForm({
    defaultValues: {
      contract: {
        termsAndConditions: contract.termsAndConditions,
        paymentTerms: contract.paymentTerms,
        status: contract.status,
      },
    } as z.infer<typeof contractFormSchema>,
    onSubmit: async ({ value }) => {
      await updateContractMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
    validatorAdapter: zodValidator(),
  });

  const handleCancel = () => {
    // Navigate back to the contract details page or list
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Edit Contract</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="contract.termsAndConditions"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Terms and Conditions
                </label>
                <Textarea
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
            name="contract.paymentTerms"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Payment Terms
                </label>
                <Textarea
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
            name="contract.status"
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

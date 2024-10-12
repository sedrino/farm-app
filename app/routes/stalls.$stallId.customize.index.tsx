import React from "react";
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
import {
  useAddStallCustomizationMutation,
  useDeleteStallCustomizationMutation,
  useStallCustomizationsQuery,
} from "@/query/mutations/stall-customizations";
import { customizationTypesListOptions } from "@/query/options/customization-types";

export const Route = createFileRoute("/stalls/$stallId/customize/")({
  component: CustomizeStallComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      stallCustomizationsListOptions({
        stallId: opts.params.stallId,
      })
    );
  },
});

const customizationFormSchema = z.object({
  customization: z.object({
    customizationType: z.string().min(1, "Customization type is required"),
    description: z.string().optional(),
    isPermanent: z.boolean().default(false),
    installationDate: z.number().optional(),
  }),
});

function CustomizeStallComponent() {
  const { stallId } = Route.useParams();
  const { data: customizations } = useSuspenseQuery(
    stallCustomizationsListOptions({
      stallId,
    })
  );
  const { data: customizationTypes } = useSuspenseQuery(
    customizationTypesListOptions()
  );

  const form = useForm({
    defaultValues: {
      customization: {
        customizationType: "",
        description: "",
        isPermanent: false,
        installationDate: Date.now(),
      },
    } as z.infer<typeof customizationFormSchema>,
    onSubmit: async ({ value }) => {
      await addCustomizationMutation.mutateAsync({
        ...value.customization,
        stallId,
      });
      queryClient.invalidateQueries({
        queryKey: ["stall-customizations", stallId],
      });
    },
    validatorAdapter: zodValidator(),
  });

  const addCustomizationMutation = useAddStallCustomizationMutation(stallId);

  const handleDeleteCustomization = (customizationId: string) => {
    deleteCustomizationMutation.mutate(customizationId);
  };

  const deleteCustomizationMutation =
    useDeleteStallCustomizationMutation(stallId);

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Customize Stall</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Current Customizations</h2>
          <ul>
            {customizations?.map((customization) => (
              <li key={customization.customizationId} className="mb-2">
                <div className="flex justify-between">
                  <span>
                    {customization.customizationType}:{" "}
                    {customization.description}
                  </span>
                  <div className="flex space-x-2">
                    <Button variant="link">Edit</Button>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        handleDeleteCustomization(customization.customizationId)
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="customization.customizationType"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Customization Type
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customization type" />
                  </SelectTrigger>
                  <SelectContent>
                    {customizationTypes?.map((type) => (
                      <SelectItem key={type.typeId} value={type.name}>
                        {type.name}
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
            name="customization.description"
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
            name="customization.isPermanent"
            children={(field) => (
              <div className="flex items-center">
                <Checkbox
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) =>
                    field.handleChange(checked === true)
                  }
                />
                <label
                  htmlFor={field.name}
                  className="ml-2 text-sm text-gray-700"
                >
                  Set as Permanent
                </label>
              </div>
            )}
          />

          <div className="flex space-x-2">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "..." : "Save Customization"}
                </Button>
              )}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}

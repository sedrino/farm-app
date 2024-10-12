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
import { useCreateStallMutation } from "@/query/mutations/stalls";
import { stallFeaturesListOptions } from "@/query/options/stall-features";

export const Route = createFileRoute("/stalls/create")({
  component: CreateStallComponent,
});

const stallFormSchema = z.object({
  stall: z.object({
    number: z.string().min(1, "Stall number is required"),
    size: z.string().optional(),
    location: z.string().min(1, "Location is required"),
    features: z.array(z.string()).default([]).optional(),
    isAvailable: z.boolean().default(true),
    notes: z.string().optional(),
  }),
  customizations: z
    .array(
      z.object({
        customizationType: z.string().min(1, "Type is required"),
        description: z.string().optional(),
      })
    )
    .default([]),
});

function CreateStallComponent() {
  const navigate = Route.useNavigate();
  const createStallMutation = useCreateStallMutation();
  const { data: features } = useSuspenseQuery(
    stallFeaturesListOptions({
      page: 1,
      pageSize: 100,
    })
  );

  const form = useForm({
    defaultValues: {
      stall: {
        number: "",
        size: "",
        location: "",
        features: [],
        isAvailable: true,
        notes: "",
      },
      customizations: [],
    } as z.infer<typeof stallFormSchema>,
    onSubmit: async ({ value }) => {
      await createStallMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["stalls"] });
      navigate({ to: "/stalls" });
    },
    validatorAdapter: zodValidator(),
  });

  const addCustomization = () => {
    form.setFieldValue("customizations", [
      ...form.getFieldValue("customizations"),
      { customizationType: "", description: "" },
    ]);
  };

  const handleCancel = () => {
    navigate({ to: "/stalls" });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Create New Stall</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="stall.number"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Stall Number
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
            name="stall.size"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Stall Size/Dimensions
                </label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          />

          <form.Field
            name="stall.location"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
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
              Features/Customizations
            </label>
            <form.Field name="stall.features" mode="array">
              {(field) => (
                <Select onValueChange={(value) => field.pushValue(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select features" />
                  </SelectTrigger>
                  <SelectContent>
                    {features?.map((feature) => (
                      <SelectItem
                        key={feature.featureId}
                        value={feature.featureId}
                      >
                        {feature.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </form.Field>
          </div>

          <form.Field
            name="stall.isAvailable"
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
                  Initial Availability Status
                </label>
              </div>
            )}
          />

          <form.Field
            name="stall.notes"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Notes/Special Instructions
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customizations
            </label>
            {form.getFieldValue("customizations").map((_, index) => (
              <div key={index} className="mb-2">
                <form.Field
                  name={`customizations[${index}].customizationType`}
                  children={(field) => (
                    <Input
                      placeholder="Customization Type"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                />
                <form.Field
                  name={`customizations[${index}].description`}
                  children={(field) => (
                    <Textarea
                      placeholder="Description"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                />
                <Button
                  type="button"
                  onClick={() =>
                    form.setFieldValue("customizations", (prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                  variant="outline"
                >
                  Remove Customization
                </Button>
              </div>
            ))}
            <Button type="button" onClick={addCustomization} variant="outline">
              Add Customization
            </Button>
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

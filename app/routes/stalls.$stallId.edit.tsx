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
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/query/client";
import {
  useDeleteStallMutation,
  useUpdateStallMutation,
} from "@/query/mutations/stalls";
import { stallDetailsOptions } from "@/query/options/stalls";

export const Route = createFileRoute("/stalls/$stallId/edit")({
  component: EditStallComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      stallDetailsOptions({
        stallId: opts.params.stallId,
      })
    );
  },
});

const stallFormSchema = z.object({
  stall: z.object({
    stallId: z.string().min(1, "Stall ID is required"),
    number: z.string().min(1, "Stall number is required"),
    size: z.string().min(1, "Size is required"),
    location: z.string().min(1, "Location is required"),
    features: z.array(z.string()).default([]),
    isAvailable: z.boolean().default(true),
    notes: z.string().optional(),
  }),
  customizations: z.array(z.string()).default([]).optional(),
});

function EditStallComponent() {
  const { stallId } = Route.useParams();
  const { data: stallData } = useSuspenseQuery(
    stallDetailsOptions({
      stallId,
    })
  );
  const updateStallMutation = useUpdateStallMutation(stallId);
  const deleteStallMutation = useDeleteStallMutation(stallId);

  const form = useForm({
    defaultValues: {
      stall: {
        stallId,
        number: stallData.number,
        size: stallData.size,
        location: stallData.location,
        features: stallData.features,
        isAvailable: stallData.isAvailable,
        notes: stallData.notes,
      },
      customizations: [],
    } as z.infer<typeof stallFormSchema>,
    onSubmit: async ({ value }) => {
      await updateStallMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["stalls", stallId] });
    },
    validatorAdapter: zodValidator(),
  });

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this stall?")) {
      deleteStallMutation.mutate();
    }
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Edit Stall</h1>
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
                  readOnly
                />
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
                  Size
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
              </div>
            )}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Features
            </label>
            <form.Field name="stall.features" mode="array">
              {(field) => (
                <div>
                  {["Rubber Mats", "Automatic Waterers", "Fans"].map(
                    (feature) => (
                      <div key={feature} className="flex items-center">
                        <Checkbox
                          id={feature}
                          checked={field.state.value?.includes(feature)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.pushValue(feature);
                            } else {
                              field.setFieldValue(
                                "stall.features",
                                field.state.value?.filter((f) => f !== feature)
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={feature}
                          className="ml-2 text-sm text-gray-700"
                        >
                          {feature}
                        </label>
                      </div>
                    )
                  )}
                </div>
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
                  Available
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
                  {isSubmitting ? "..." : "Save Changes"}
                </Button>
              )}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete Stall
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}

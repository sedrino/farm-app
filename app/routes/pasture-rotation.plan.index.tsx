import React from "react";
import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { queryClient } from "@/query/client";
import { useCreatePastureRotationMutation } from "@/query/mutations/pasture-rotations";
import { pasturesListOptions } from "@/query/options/pastures";

export const Route = createFileRoute("/pasture-rotation/plan/")({
  component: PastureRotationPlanComponent,
});

const pastureRotationPlanSchema = z.object({
  rotation: z.object({
    pastureId: z.string().min(1, "Pasture is required"),
    horseIds: z.array(z.string()).min(1, "At least one horse is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  }),
});

function PastureRotationPlanComponent() {
  const navigate = Route.useNavigate();
  const createPastureRotationMutation = useCreatePastureRotationMutation();
  const { data: pastures } = useSuspenseQuery(
    pasturesListOptions({
      page: 1,
      pageSize: 100,
    })
  );

  const form = useForm({
    defaultValues: {
      rotation: {
        pastureId: "",
        horseIds: [],
        startDate: "",
        endDate: "",
      },
    } as z.infer<typeof pastureRotationPlanSchema>,
    onSubmit: async ({ value }) => {
      await createPastureRotationMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["pasture-rotations"] });
      navigate({ to: "/pasture-rotation" });
    },
    validatorAdapter: zodValidator(),
  });

  const handleCancel = () => {
    navigate({ to: "/pasture-rotation" });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Plan Pasture Rotation</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="rotation.pastureId"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Pasture
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a pasture" />
                  </SelectTrigger>
                  <SelectContent>
                    {pastures?.map((pasture) => (
                      <SelectItem
                        key={pasture.pastureId}
                        value={pasture.pastureId}
                      >
                        {pasture.name}
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
            name="rotation.horseIds"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Horses
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value.split(","))
                  }
                  multiple
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select horses" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Assuming we have a list of horses to select from */}
                    {/* {horses?.map((horse) => (
                      <SelectItem key={horse.horseId} value={horse.horseId}>
                        {horse.name}
                      </SelectItem>
                    ))} */}
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
            name="rotation.startDate"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>
                <Input
                  id={field.name}
                  type="date"
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
            name="rotation.endDate"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>
                <Input
                  id={field.name}
                  type="date"
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
                  {isSubmitting ? "..." : "Save Plan"}
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
              Reset
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}

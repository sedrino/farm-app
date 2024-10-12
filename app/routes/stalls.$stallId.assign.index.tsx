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
import { useAssignHorseMutation } from "@/query/mutations/stall-assignments";
import { horsesListOptions } from "@/query/options/horses";
import { stallDetailsOptions } from "@/query/options/stalls";

export const Route = createFileRoute("/stalls/$stallId/assign/")({
  component: AssignHorseToStallComponent,
  loader: (opts) => {
    return Promise.all([
      opts.context.queryClient.ensureQueryData(
        stallDetailsOptions({
          stallId: opts.params.stallId,
        })
      ),
      opts.context.queryClient.ensureQueryData(
        horsesListOptions({
          page: 1,
          pageSize: 100,
        })
      ),
    ]);
  },
});

const assignmentFormSchema = z.object({
  assignment: z.object({
    horseId: z.string().min(1, "Horse is required"),
    startDate: z.string().min(1, "Start date is required"),
    expectedDuration: z.string().min(1, "Expected duration is required"),
  }),
  notes: z.string().optional(),
});

function AssignHorseToStallComponent() {
  const { stallId } = Route.useParams();
  const { data: stall } = useSuspenseQuery(
    stallDetailsOptions({
      stallId,
    })
  );
  const { data: horses } = useSuspenseQuery(
    horsesListOptions({
      page: 1,
      pageSize: 100,
    })
  );

  const assignHorseMutation = useAssignHorseMutation(stallId);

  const form = useForm({
    defaultValues: {
      assignment: {
        horseId: "",
        startDate: "",
        expectedDuration: "",
      },
      notes: "",
    } as z.infer<typeof assignmentFormSchema>,
    onSubmit: async ({ value }) => {
      await assignHorseMutation.mutateAsync({
        stallId,
        ...value.assignment,
        notes: value.notes,
      });
      queryClient.invalidateQueries({ queryKey: ["stall-assignments"] });
    },
    validatorAdapter: zodValidator(),
  });

  const handleCancel = () => {
    // Navigate back to the stall details page or previous page
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Assign Horse to Stall</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <div>
            <h2 className="text-xl font-semibold">Stall Information</h2>
            <p>Stall Number: {stall.number}</p>
            <p>Stall Size: {stall.size}</p>
            <p>Location: {stall.location}</p>
            <p>Features: {stall.features}</p>
            <p>Notes: {stall.notes}</p>
          </div>

          <form.Field
            name="assignment.horseId"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Horse
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a horse" />
                  </SelectTrigger>
                  <SelectContent>
                    {horses.map((horse) => (
                      <SelectItem key={horse.horseId} value={horse.horseId}>
                        {horse.name}
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
            name="assignment.startDate"
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
            name="assignment.expectedDuration"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Expected Duration
                </label>
                <Input
                  id={field.name}
                  type="text"
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
            name="notes"
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
                  {isSubmitting ? "..." : "Assign"}
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

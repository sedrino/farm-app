import React from "react";
import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { useCreateHealthRecordMutation } from "@/query/mutations/health-records";
import { horseOptions } from "@/query/options/horses";

export const Route = createFileRoute("/horses/$horseId/health/create")({
  component: CreateHealthRecordComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      horseOptions({
        horseId: opts.params.horseId,
      })
    );
  },
});

const healthRecordFormSchema = z.object({
  healthRecord: z.object({
    horseId: z.string().min(1, "Horse is required"),
    eventDate: z.string().min(1, "Date is required"),
    eventType: z
      .enum(["vaccination", "check-up", "injury", "treatment", "other"])
      .default("other"),
    description: z.string().min(1, "Description is required"),
    veterinarian: z.string().min(1, "Veterinarian is required"),
    medications: z.string().optional(),
    followUpRequired: z.boolean().default(false),
    followUpDate: z.string().optional(),
  }),
  documents: z.array(z.string()).default([]).optional(),
});

function CreateHealthRecordComponent() {
  const { horseId } = Route.useParams();
  const navigate = Route.useNavigate();
  const createHealthRecordMutation = useCreateHealthRecordMutation(horseId);
  const { data: horse } = useSuspenseQuery(
    horseOptions({
      horseId,
    })
  );

  const form = useForm({
    defaultValues: {
      healthRecord: {
        horseId,
        eventDate: "",
        eventType: "other",
        description: "",
        veterinarian: "",
        medications: "",
        followUpRequired: false,
        followUpDate: "",
      },
      documents: [],
    } as z.infer<typeof healthRecordFormSchema>,
    onSubmit: async ({ value }) => {
      await createHealthRecordMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["health-records", horseId] });
      navigate({ to: `/horses/${horseId}/health` });
    },
    validatorAdapter: zodValidator(),
  });

  const handleCancel = () => {
    navigate({ to: `/horses/${horseId}/health` });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Add Health Record</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="healthRecord.eventDate"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Date of Event
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
            name="healthRecord.eventType"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Type of Event
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vaccination">Vaccination</SelectItem>
                    <SelectItem value="check-up">Check-up</SelectItem>
                    <SelectItem value="injury">Injury</SelectItem>
                    <SelectItem value="treatment">Treatment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <form.Field
            name="healthRecord.description"
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
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-2 text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          />

          <form.Field
            name="healthRecord.veterinarian"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Veterinarian
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
            name="healthRecord.medications"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Medications Administered
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
            name="healthRecord.followUpRequired"
            children={(field) => (
              <div className="flex items-center">
                <Input
                  id={field.name}
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
                <label
                  htmlFor={field.name}
                  className="ml-2 text-sm text-gray-700"
                >
                  Follow-up Required
                </label>
              </div>
            )}
          />

          {form.getFieldValue("healthRecord.followUpRequired") && (
            <form.Field
              name="healthRecord.followUpDate"
              children={(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Follow-up Date
                  </label>
                  <Input
                    id={field.name}
                    type="date"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            />
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Documents
            </label>
            <Input type="file" />
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
          </div>
        </form>
      </Panel>
    </div>
  );
}

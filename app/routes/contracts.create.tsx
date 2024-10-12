import React from "react";
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
import { useCreateContractMutation } from "@/query/mutations/contracts";
import { boardersListOptions } from "@/query/options/boarders";
import { horsesListOptions } from "@/query/options/horses";

export const Route = createFileRoute("/contracts/create")({
  component: CreateContractComponent,
});

const contractFormSchema = z.object({
  contract: z.object({
    boarderId: z.string().min(1, "Boarder is required"),
    startDate: z.number().min(1, "Start date is required"),
    endDate: z.number().min(1, "End date is required"),
    paymentTerms: z.string().min(1, "Payment terms are required"),
    boardingFees: z.string().min(1, "Boarding fees are required"),
    additionalServices: z.string().optional(),
    specialConditions: z.string().optional(),
  }),
  horses: z.array(z.string()).default([]).optional(),
});

function CreateContractComponent() {
  const navigate = Route.useNavigate();
  const createContractMutation = useCreateContractMutation();
  const { data: boarders } = useSuspenseQuery(
    boardersListOptions({
      page: 1,
      pageSize: 100,
    })
  );
  const { data: horses } = useSuspenseQuery(
    horsesListOptions({
      page: 1,
      pageSize: 100,
    })
  );

  const form = useForm({
    defaultValues: {
      contract: {
        boarderId: "",
        startDate: Date.now(),
        endDate: Date.now(),
        paymentTerms: "",
        boardingFees: "",
        additionalServices: "",
        specialConditions: "",
      },
      horses: [],
    } as z.infer<typeof contractFormSchema>,
    onSubmit: async ({ value }) => {
      await createContractMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      navigate({ to: "/contracts" });
    },
    validatorAdapter: zodValidator(),
  });

  const handleCancel = () => {
    navigate({ to: "/contracts" });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Create New Contract</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="contract.boarderId"
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
            name="contract.startDate"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>
                <DatePicker
                  id={field.name}
                  selected={new Date(field.state.value)}
                  onChange={(date) => field.handleChange(date.getTime())}
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
            name="contract.endDate"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>
                <DatePicker
                  id={field.name}
                  selected={new Date(field.state.value)}
                  onChange={(date) => field.handleChange(date.getTime())}
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
            name="contract.horses"
            mode="array"
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Horse(s) Covered by the Contract
                </label>
                <Select
                  onValueChange={(value) => field.pushValue(value.split(","))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select horses" />
                  </SelectTrigger>
                  <SelectContent>
                    {horses?.map((horse) => (
                      <SelectItem key={horse.horseId} value={horse.horseId}>
                        {horse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            name="contract.boardingFees"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Boarding Fees
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
            name="contract.additionalServices"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Additional Services
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
            name="contract.specialConditions"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Special Conditions
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
                  {isSubmitting ? "..." : "Save and Submit"}
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
              Save as Draft
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}

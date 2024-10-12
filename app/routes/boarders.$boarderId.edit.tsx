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
import { useUpdateBoarderMutation } from "@/query/mutations/boarders";
import { boarderDetailsOptions } from "@/query/options/boarders";

export const Route = createFileRoute("/boarders/$boarderId/edit")({
  component: EditBoarderComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      boarderDetailsOptions({
        boarderId: opts.params.boarderId,
      })
    );
  },
});

const boarderFormSchema = z.object({
  boarder: z.object({
    name: z.string().min(1, "Name is required"),
    contactDetails: z.string().min(1, "Contact details are required"),
    emergencyContact: z.string().optional(),
    contractStatus: z.string().min(1, "Contract status is required"),
    billingInfo: z.string().optional(),
    preferences: z.string().optional(),
    profilePicture: z.string().optional(),
  }),
  horses: z.array(z.string()).default([]).optional(),
  documents: z.array(z.string()).default([]).optional(),
});

function EditBoarderComponent() {
  const { boarderId } = Route.useParams();
  const { data: boarder } = useSuspenseQuery(
    boarderDetailsOptions({
      boarderId,
    })
  );
  const updateBoarderMutation = useUpdateBoarderMutation(boarderId);

  const form = useForm({
    defaultValues: {
      boarder: {
        name: boarder.name,
        contactDetails: JSON.stringify(boarder.contactDetails),
        emergencyContact: boarder.emergencyContact,
        contractStatus: boarder.contractStatus,
        billingInfo: JSON.stringify(boarder.billingInfo),
        preferences: JSON.stringify(boarder.preferences),
        profilePicture: boarder.profilePicture,
      },
      horses: boarder.horses.map((horse) => horse.horseId),
      documents: [],
    } as z.infer<typeof boarderFormSchema>,
    onSubmit: async ({ value }) => {
      await updateBoarderMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["boarders"] });
    },
    validatorAdapter: zodValidator(),
  });

  const handleCancel = () => {
    // Navigate back to the boarder's detail page
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Edit Boarder Profile</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="boarder.name"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
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
            name="boarder.contactDetails"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact Details
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
            name="boarder.emergencyContact"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Emergency Contact
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
            name="boarder.contractStatus"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Contract Status
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
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
            name="boarder.billingInfo"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Billing Information
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
            name="boarder.preferences"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Preferences
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
            name="boarder.profilePicture"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Profile Picture
                </label>
                <Input
                  id={field.name}
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        field.handleChange(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            )}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Associated Horses
            </label>
            <form.Field name="horses" mode="array">
              {(field) => (
                <div>
                  <Select onValueChange={(value) => field.pushValue(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select horses" />
                    </SelectTrigger>
                    <SelectContent>
                      {boarder.horses.map((horse) => (
                        <SelectItem key={horse.horseId} value={horse.horseId}>
                          {horse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Documents
            </label>
            <form.Field name="documents" mode="array">
              {(field) => (
                <div>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        const fileUrls = Array.from(files).map((file) => {
                          const reader = new FileReader();
                          reader.readAsDataURL(file);
                          return reader.result;
                        });
                        field.handleChange(fileUrls);
                      }
                    }}
                  />
                </div>
              )}
            </form.Field>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contract Details
            </label>
            <form.Field name="contractDetails" mode="array">
              {(field) => (
                <div>
                  <Textarea
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Billing and Payment Information
            </label>
            <form.Field name="billingAndPaymentInfo" mode="array">
              {(field) => (
                <div>
                  <Textarea
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>
          </div>

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

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
import { useCreateBoarderMutation } from "@/query/mutations/boarders";
import { horsesListOptions } from "@/query/options/horses";

export const Route = createFileRoute("/boarders/create")({
  component: CreateBoarderComponent,
});

const boarderFormSchema = z.object({
  boarder: z.object({
    name: z.string().min(1, "Name is required"),
    contactDetails: z.string().min(1, "Contact details are required"),
    emergencyContact: z.string().optional(),
    preferences: z.string().optional(),
    billingInfo: z.string().optional(),
    contractStatus: z.string().default("active"),
  }),
  horses: z.array(z.string()).default([]).optional(),
  documents: z.array(z.string()).default([]).optional(),
});

function CreateBoarderComponent() {
  const navigate = Route.useNavigate();
  const createBoarderMutation = useCreateBoarderMutation();
  const { data: horses } = useSuspenseQuery(horsesListOptions());

  const form = useForm({
    defaultValues: {
      boarder: {
        name: "",
        contactDetails: "",
        emergencyContact: "",
        preferences: "",
        billingInfo: "",
        contractStatus: "active",
      },
      horses: [],
      documents: [],
    } as z.infer<typeof boarderFormSchema>,
    onSubmit: async ({ value }) => {
      await createBoarderMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["boarders"] });
      navigate({ to: "/boarders" });
    },
    validatorAdapter: zodValidator(),
  });

  const handleCancel = () => {
    navigate({ to: "/boarders" });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Create New Boarder</h1>
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Associated Horses
            </label>
            <form.Field name="horses" mode="array">
              {(field) => (
                <Select onValueChange={(value) => field.pushValue(value)}>
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
              )}
            </form.Field>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Documents
            </label>
            <form.Field name="documents" mode="array">
              {(field) => (
                <Input
                  type="file"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      const fileUrls = Array.from(files).map(
                        (file) => file.name
                      );
                      field.handleChange(fileUrls);
                    }
                  }}
                />
              )}
            </form.Field>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contract Details
            </label>
            <Textarea
              placeholder="Enter initial contract details"
              onChange={(e) =>
                form.setFieldValue("boarder.contractDetails", e.target.value)
              }
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
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}

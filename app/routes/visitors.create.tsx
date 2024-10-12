import { useForm } from "@tanstack/react-form";
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
import { useCreateVisitorMutation } from "@/query/mutations/visitors";

export const Route = createFileRoute("/visitors/create")({
  component: CreateVisitorComponent,
});

const visitorFormSchema = z.object({
  visitor: z.object({
    name: z.string().min(1, "Visitor name is required"),
    type: z.string().min(1, "Visitor type is required"),
    contactInformation: z.string().optional(),
    associatedBoarders: z.array(z.string()).optional(),
    visitFrequency: z.string().optional(),
    specialInstructions: z.string().optional(),
  }),
  documents: z.array(z.string()).default([]).optional(),
});

function CreateVisitorComponent() {
  const navigate = Route.useNavigate();
  const createVisitorMutation = useCreateVisitorMutation();

  const form = useForm({
    defaultValues: {
      visitor: {
        name: "",
        type: "",
        contactInformation: "",
        associatedBoarders: [],
        visitFrequency: "",
        specialInstructions: "",
      },
      documents: [],
    } as z.infer<typeof visitorFormSchema>,
    onSubmit: async ({ value }) => {
      await createVisitorMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
      navigate({ to: "/visitors" });
    },
    validatorAdapter: zodValidator(),
  });

  const handleCancel = () => {
    navigate({ to: "/visitors" });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Create New Visitor</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="visitor.name"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Visitor Name
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
            name="visitor.type"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Visitor Type
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visitor type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trainer">Trainer</SelectItem>
                    <SelectItem value="vet">Vet</SelectItem>
                    <SelectItem value="farrier">Farrier</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <form.Field
            name="visitor.contactInformation"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact Information
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
            name="visitor.associatedBoarders"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Associated Boarders
                </label>
                <Select
                  value={field.state.value?.join(",")}
                  onValueChange={(value) =>
                    field.handleChange(value.split(","))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select associated boarders" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Assuming we have a list of boarders to select from */}
                    <SelectItem value="boarder1">Boarder 1</SelectItem>
                    <SelectItem value="boarder2">Boarder 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <form.Field
            name="visitor.visitFrequency"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Anticipated Frequency of Visits
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
            name="visitor.specialInstructions"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Special Instructions or Notes
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
              Upload Documentation
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

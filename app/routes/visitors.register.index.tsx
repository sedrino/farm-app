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

export const Route = createFileRoute("/visitors/register/")({
  component: RegisterVisitorComponent,
});

const visitorFormSchema = z.object({
  visitor: z.object({
    name: z.string().min(1, "Name is required"),
    contactInfo: z.string().min(1, "Contact information is required"),
    visitorType: z.string().min(1, "Visitor type is required"),
    purpose: z.string().min(1, "Purpose is required"),
    visitDate: z.string().min(1, "Visit date is required"),
    visitTime: z.string().min(1, "Visit time is required"),
    duration: z.string().min(1, "Duration is required"),
    associatedBoarderId: z.string().optional(),
    associatedHorseId: z.string().optional(),
    specialRequirements: z.string().optional(),
    notes: z.string().optional(),
  }),
});

function RegisterVisitorComponent() {
  const navigate = Route.useNavigate();
  const createVisitorMutation = useCreateVisitorMutation();

  const form = useForm({
    defaultValues: {
      visitor: {
        name: "",
        contactInfo: "",
        visitorType: "",
        purpose: "",
        visitDate: "",
        visitTime: "",
        duration: "",
        associatedBoarderId: undefined,
        associatedHorseId: undefined,
        specialRequirements: "",
        notes: "",
      },
    } as z.infer<typeof visitorFormSchema>,
    onSubmit: async ({ value }) => {
      await createVisitorMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
      navigate({ to: "/visitors" });
    },
    validatorAdapter: zodValidator(),
  });

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Register New Visitor</h1>
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
            name="visitor.contactInfo"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact Information
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
            name="visitor.visitorType"
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
                    <SelectItem value="veterinarian">Veterinarian</SelectItem>
                    <SelectItem value="farrier">Farrier</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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
            name="visitor.purpose"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Purpose of Visit
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
            name="visitor.visitDate"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Visit Date
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
            name="visitor.visitTime"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Visit Time
                </label>
                <Input
                  id={field.name}
                  type="time"
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
            name="visitor.duration"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Duration of Stay
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
            name="visitor.associatedBoarderId"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Associated Boarder
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select boarder" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Map through boarders and create SelectItem for each */}
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <form.Field
            name="visitor.associatedHorseId"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Associated Horse
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select horse" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Map through horses and create SelectItem for each */}
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <form.Field
            name="visitor.specialRequirements"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Special Requirements
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
            name="visitor.notes"
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
                  {isSubmitting ? "..." : "Register Visitor"}
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

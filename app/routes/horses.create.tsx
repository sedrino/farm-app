import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/query/client";
import { useCreateHorseMutation } from "@/query/mutations/horses";
import { ownersListOptions } from "@/query/options/owners";
import { stallsListOptions } from "@/query/options/stalls";

export const Route = createFileRoute("/horses/create")({
  component: CreateHorseComponent,
});

const horseFormSchema = z.object({
  horse: z.object({
    name: z.string().min(1, "Name is required"),
    breed: z.string().min(1, "Breed is required"),
    dateOfBirth: z.string().min(1, "Date of Birth is required"),
    gender: z.string().min(1, "Gender is required"),
    color: z.string().min(1, "Color is required"),
    markings: z.string().optional(),
    height: z.number().optional(),
    weight: z.number().optional(),
    microchipNumber: z.string().optional(),
    ownerId: z.string().optional(),
    stallId: z.string().optional(),
    specialNeeds: z.string().optional(),
    medicalHistory: z.string().optional(),
    feedingPreferences: z.string().optional(),
    exercisePreferences: z.string().optional(),
    profilePicture: z.string().optional(),
    documents: z.string().optional(),
    arrivalDate: z.string().optional(),
    status: z.string().optional(),
  }),
  photos: z.array(z.string()).default([]).optional(),
  documents: z.array(z.string()).default([]).optional(),
});

function CreateHorseComponent() {
  const navigate = Route.useNavigate();
  const createHorseMutation = useCreateHorseMutation();
  const { data: owners } = useSuspenseQuery(ownersListOptions());
  const { data: stalls } = useSuspenseQuery(stallsListOptions());

  const form = useForm({
    defaultValues: {
      horse: {
        name: "",
        breed: "",
        dateOfBirth: "",
        gender: "",
        color: "",
        markings: "",
        height: undefined,
        weight: undefined,
        microchipNumber: "",
        ownerId: undefined,
        stallId: undefined,
        specialNeeds: "",
        medicalHistory: "",
        feedingPreferences: "",
        exercisePreferences: "",
        profilePicture: "",
        documents: "",
        arrivalDate: "",
        status: "",
      },
      photos: [],
      documents: [],
    } as z.infer<typeof horseFormSchema>,
    onSubmit: async ({ value }) => {
      await createHorseMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["horses"] });
      navigate({ to: "/horses" });
    },
    validatorAdapter: zodValidator(),
  });

  const handleCancel = () => {
    navigate({ to: "/horses" });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Create New Horse Profile</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="horse.name"
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
            name="horse.breed"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Breed
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
            name="horse.dateOfBirth"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Date of Birth
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
            name="horse.gender"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Gender
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
            name="horse.color"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Color
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
            name="horse.markings"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Markings
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
            name="horse.height"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Height
                </label>
                <Input
                  id={field.name}
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
              </div>
            )}
          />

          <form.Field
            name="horse.weight"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Weight
                </label>
                <Input
                  id={field.name}
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
              </div>
            )}
          />

          <form.Field
            name="horse.microchipNumber"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Microchip Number
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
            name="horse.ownerId"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Owner
                </label>
                <select
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                >
                  <option value="">Select Owner</option>
                  {owners?.map((owner) => (
                    <option key={owner.userId} value={owner.userId}>
                      {owner.username}
                    </option>
                  ))}
                </select>
              </div>
            )}
          />

          <form.Field
            name="horse.arrivalDate"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Arrival Date
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

          <form.Field
            name="horse.stallId"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Assigned Stall
                </label>
                <select
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                >
                  <option value="">Select Stall</option>
                  {stalls?.map((stall) => (
                    <option key={stall.stallId} value={stall.stallId}>
                      {stall.number}
                    </option>
                  ))}
                </select>
              </div>
            )}
          />

          <form.Field
            name="horse.specialNeeds"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Special Needs
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
            name="horse.medicalHistory"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Medical History
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
            name="horse.feedingPreferences"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Feeding Preferences
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
            name="horse.exercisePreferences"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Exercise Preferences
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
              Photos
            </label>
            <form.Field name="photos" mode="array">
              {(field) => (
                <div>
                  <Input
                    type="file"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const fileUrls = files.map((file) =>
                        URL.createObjectURL(file)
                      );
                      field.pushValue(fileUrls);
                    }}
                  />
                  <div className="mt-2">
                    {field.state.value?.map((photoUrl, index) => (
                      <img
                        key={index}
                        src={photoUrl}
                        alt={`Horse Photo ${index + 1}`}
                        className="mr-2 h-20 w-20 rounded"
                      />
                    ))}
                  </div>
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
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const fileUrls = files.map((file) =>
                        URL.createObjectURL(file)
                      );
                      field.pushValue(fileUrls);
                    }}
                  />
                  <div className="mt-2">
                    {field.state.value?.map((documentUrl, index) => (
                      <p key={index}>{`Document ${index + 1}`}</p>
                    ))}
                  </div>
                </div>
              )}
            </form.Field>
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

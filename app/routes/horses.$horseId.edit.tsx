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
import {
  useDeleteHorseMutation,
  useUpdateHorseMutation,
} from "@/query/mutations/horses";
import { horseDetailsOptions } from "@/query/options/horses";

export const Route = createFileRoute("/horses/$horseId/edit")({
  component: EditHorseComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      horseDetailsOptions({
        horseId: opts.params.horseId,
      })
    );
  },
});

const horseFormSchema = z.object({
  horse: z.object({
    name: z.string().min(1, "Name is required"),
    breed: z.string().min(1, "Breed is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
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
    knownConditions: z.string().optional(),
    allergies: z.string().optional(),
    currentMedication: z.string().optional(),
    documents: z.string().optional(),
    photos: z.string().optional(),
    arrivalDate: z.string().min(1, "Arrival date is required"),
    lastViewed: z.string().optional(),
    status: z.string().optional(),
  }),
});

function EditHorseComponent() {
  const { horseId } = Route.useParams();
  const { data: horseData } = useSuspenseQuery(
    horseDetailsOptions({
      horseId,
    })
  );
  const updateHorseMutation = useUpdateHorseMutation(horseId);
  const deleteHorseMutation = useDeleteHorseMutation(horseId);

  const form = useForm({
    defaultValues: {
      horse: {
        name: horseData.name,
        breed: horseData.breed,
        dateOfBirth: horseData.dateOfBirth,
        gender: horseData.gender,
        color: horseData.color,
        markings: horseData.markings,
        height: horseData.height,
        weight: horseData.weight,
        microchipNumber: horseData.microchipNumber,
        ownerId: horseData.ownerId,
        stallId: horseData.stallId,
        specialNeeds: horseData.specialNeeds,
        medicalHistory: horseData.medicalHistory,
        feedingPreferences: horseData.feedingPreferences,
        exercisePreferences: horseData.exercisePreferences,
        profilePicture: horseData.profilePicture,
        knownConditions: horseData.knownConditions,
        allergies: horseData.allergies,
        currentMedication: horseData.currentMedication,
        documents: horseData.documents,
        photos: horseData.photos,
        arrivalDate: horseData.arrivalDate,
        lastViewed: horseData.lastViewed,
        status: horseData.status,
      },
    } as z.infer<typeof horseFormSchema>,
    onSubmit: async ({ value }) => {
      await updateHorseMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["horses", horseId] });
    },
    validatorAdapter: zodValidator(),
  });

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this horse?")) {
      deleteHorseMutation.mutate(undefined, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["horses"] });
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Edit Horse Profile</h1>
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
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
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
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Assuming you have a list of owners to select from */}
                    <SelectItem value="owner1">Owner 1</SelectItem>
                    <SelectItem value="owner2">Owner 2</SelectItem>
                  </SelectContent>
                </Select>
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
                  Stall Assignment
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stall" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Assuming you have a list of stalls to select from */}
                    <SelectItem value="stall1">Stall 1</SelectItem>
                    <SelectItem value="stall2">Stall 2</SelectItem>
                  </SelectContent>
                </Select>
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

          <form.Field
            name="horse.profilePicture"
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
                      // Handle file upload or conversion to a suitable format
                      field.handleChange(file.name); // Example: Set the file name
                    }
                  }}
                />
              </div>
            )}
          />

          <form.Field
            name="horse.knownConditions"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Known Conditions
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
            name="horse.allergies"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Allergies
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
            name="horse.currentMedication"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Current Medication
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
              Documents
            </label>
            <form.Field name="horse.documents" mode="array">
              {(field) => (
                <div>
                  {/* Display existing documents and provide options to add or remove */}
                  {field.state.value?.map((doc, index) => (
                    <div key={index} className="flex space-x-2">
                      <span>{doc}</span>
                      <Button
                        type="button"
                        onClick={() =>
                          form.setFieldValue("documents", (prev) =>
                            prev?.filter((_, i) => i !== index)
                          )
                        }
                        variant="outline"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() =>
                      form.setFieldValue("documents", (prev) => [
                        ...(prev || []),
                        "New Document",
                      ])
                    }
                    variant="outline"
                  >
                    Add Document
                  </Button>
                </div>
              )}
            </form.Field>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Photos
            </label>
            <form.Field name="horse.photos" mode="array">
              {(field) => (
                <div>
                  {/* Display existing photos and provide options to add or remove */}
                  {field.state.value?.map((photo, index) => (
                    <div key={index} className="flex space-x-2">
                      <span>{photo}</span>
                      <Button
                        type="button"
                        onClick={() =>
                          form.setFieldValue("photos", (prev) =>
                            prev?.filter((_, i) => i !== index)
                          )
                        }
                        variant="outline"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() =>
                      form.setFieldValue("photos", (prev) => [
                        ...(prev || []),
                        "New Photo",
                      ])
                    }
                    variant="outline"
                  >
                    Add Photo
                  </Button>
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
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete Horse
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}

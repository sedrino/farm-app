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
import { useUpdateBookingMutation } from "@/query/mutations/bookings";
import { bookingDetailsOptions } from "@/query/options/bookings";

export const Route = createFileRoute("/bookings/$bookingId/edit")({
  component: EditBookingComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      bookingDetailsOptions({
        bookingId: opts.params.bookingId,
      })
    );
  },
});

const bookingFormSchema = z.object({
  booking: z.object({
    facilityId: z.string().min(1, "Facility is required"),
    userId: z.string().min(1, "User is required"),
    startTime: z.number().min(1, "Start time is required"),
    endTime: z.number().min(1, "End time is required"),
    purpose: z.string().optional(),
    status: z.string().min(1, "Status is required"),
  }),
});

function EditBookingComponent() {
  const { bookingId } = Route.useParams();
  const { data } = useSuspenseQuery(
    bookingDetailsOptions({
      bookingId,
    })
  );

  const updateBookingMutation = useUpdateBookingMutation(bookingId);

  const form = useForm({
    defaultValues: {
      booking: {
        facilityId: data.facilityId,
        userId: data.userId,
        startTime: data.startTime,
        endTime: data.endTime,
        purpose: data.purpose,
        status: data.status,
      },
    } as z.infer<typeof bookingFormSchema>,
    onSubmit: async ({ value }) => {
      await updateBookingMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    validatorAdapter: zodValidator(),
  });

  const handleCancel = () => {
    // Navigate back to booking details
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Edit Booking</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="booking.facilityId"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Facility
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
            name="booking.userId"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  User
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
            name="booking.startTime"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Time
                </label>
                <Input
                  id={field.name}
                  type="time"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
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
            name="booking.endTime"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  End Time
                </label>
                <Input
                  id={field.name}
                  type="time"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
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
            name="booking.purpose"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Purpose
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
            name="booking.status"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
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
              Cancel Edit
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}

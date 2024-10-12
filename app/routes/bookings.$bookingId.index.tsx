import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { useCancelBookingMutation } from "@/query/mutations/facility-bookings";
import { facilityBookingOptions } from "@/query/options/facility-bookings";

export const Route = createFileRoute("/bookings/$bookingId/")({
  component: BookingDetailsComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      facilityBookingOptions({
        bookingId: opts.params.bookingId,
      })
    );
  },
});

function BookingDetailsComponent() {
  const { bookingId } = Route.useParams();
  const { data } = useSuspenseQuery(
    facilityBookingOptions({
      bookingId,
    })
  );

  const cancelBookingMutation = useCancelBookingMutation(bookingId);

  const handleCancel = () => {
    cancelBookingMutation.mutate(undefined, {
      onSuccess: () => {
        // Optionally, navigate to a different page or show a success message
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Booking Details</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Booking Information</h2>
          <p>Facility: {data.facility.name}</p>
          <p>Date: {formatDate(data.startDate)}</p>
          <p>Time: {data.startTime}</p>
          <p>Duration: {data.duration} hours</p>
          <p>Purpose: {data.purpose}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Boarder Information</h2>
          <p>Name: {data.boarder.name}</p>
          <p>Contact Details: {data.boarder.contactDetails}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="destructive" onClick={handleCancel}>
            Cancel Booking
          </Button>
          <Button variant="outline">Modify Booking</Button>
          <Button variant="outline">Add to Calendar</Button>
        </div>
      </Panel>
    </div>
  );
}

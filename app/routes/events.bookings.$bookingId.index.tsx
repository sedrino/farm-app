import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { useUpdateFacilityBookingMutation } from "@/query/mutations/facility-bookings";
import { facilityBookingOptions } from "@/query/options/facility-bookings";

export const Route = createFileRoute("/events/bookings/$bookingId/")({
  component: FacilityBookingDetailsComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      facilityBookingOptions({
        bookingId: opts.params.bookingId,
      })
    );
  },
});

function FacilityBookingDetailsComponent() {
  const { bookingId } = Route.useParams();
  const { data } = useSuspenseQuery(
    facilityBookingOptions({
      bookingId,
    })
  );
  const updateFacilityBookingMutation =
    useUpdateFacilityBookingMutation(bookingId);

  const handleEdit = () => {
    // Logic to handle editing the booking
  };

  const handleCancel = () => {
    // Logic to handle canceling the booking
  };

  const handleApprove = () => {
    // Logic to handle approving the booking
  };

  const handleDeny = () => {
    // Logic to handle denying the booking
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Facility Booking Details</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Facility Booked</h2>
          <p>{data.facility.name}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Date and Time</h2>
          <p>
            {new Date(data.startTime).toLocaleString()} - {data.duration}{" "}
            minutes
          </p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Boarder</h2>
          <p>{data.boarder.name}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Purpose</h2>
          <p>{data.purpose}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Notes</h2>
          <Input value={data.notes} readOnly />
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleEdit}>Edit</Button>
          <Button variant="destructive" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApprove}>Approve</Button>
          <Button variant="destructive" onClick={handleDeny}>
            Deny
          </Button>
        </div>
      </Panel>
    </div>
  );
}

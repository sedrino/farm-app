import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { useCreateBookingMutation } from "@/query/mutations/bookings";
import { bookingsListOptions } from "@/query/options/bookings";
import { facilityOptions } from "@/query/options/facilities";

export const Route = createFileRoute("/facilities/$facilityId/")({
  component: FacilityDetailsComponent,
  loader: (opts) => {
    return Promise.all([
      opts.context.queryClient.ensureQueryData(
        facilityOptions({
          facilityId: opts.params.facilityId,
        })
      ),
      opts.context.queryClient.ensureQueryData(
        bookingsListOptions({
          facilityId: opts.params.facilityId,
          dateRange: "next_30_days",
        })
      ),
    ]);
  },
});

function FacilityDetailsComponent() {
  const { facilityId } = Route.useParams();
  const { data: facility } = useSuspenseQuery(
    facilityOptions({
      facilityId,
    })
  );
  const { data: bookings } = useSuspenseQuery(
    bookingsListOptions({
      facilityId,
      dateRange: "next_30_days",
    })
  );
  const createBookingMutation = useCreateBookingMutation(facilityId);

  const handleBookNow = () => {
    createBookingMutation.mutate({
      facilityId,
      startTime: Date.now(),
      endTime: Date.now() + 3600000, // 1 hour later
    });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">{facility.name}</h1>
        <p>
          <strong>Type:</strong> {facility.type}
        </p>
        <p>
          <strong>Capacity:</strong> {facility.capacity}
        </p>
        <p>
          <strong>Description:</strong> {facility.description}
        </p>
        <p>
          <strong>Amenities:</strong> {facility.amenities.join(", ")}
        </p>
        <div className="mt-4">
          <h2 className="text-xl font-bold">Photo Gallery</h2>
          <div className="flex space-x-2">
            {facility.photoGallery.map((photoUrl) => (
              <img
                key={photoUrl}
                src={photoUrl}
                alt="Facility"
                className="h-32 w-32 rounded object-cover"
              />
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-bold">Availability Calendar</h2>
          {/* Placeholder for calendar component */}
          <p>This will show availability for the next 30 days.</p>
        </div>
        <div className="mt-4 flex space-x-2">
          <Button onClick={handleBookNow}>Book Now</Button>
          <Button variant="outline">Edit Facility</Button>
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-bold">Upcoming Bookings</h2>
          <ul>
            {bookings.map((booking) => (
              <li key={booking.bookingId}>
                {formatDate(booking.startTime)} - {formatDate(booking.endTime)}
              </li>
            ))}
          </ul>
        </div>
      </Panel>
    </div>
  );
}

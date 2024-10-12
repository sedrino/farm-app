import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { useCreateHealthRecordMutation } from "@/query/mutations/health-records";
import { healthRecordsListOptions } from "@/query/options/health-records";

export const Route = createFileRoute("/horses/$horseId/health/")({
  component: HorseHealthPageComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      healthRecordsListOptions({
        horseId: opts.params.horseId,
      })
    );
  },
});

function HorseHealthPageComponent() {
  const { horseId } = Route.useParams();
  const { data } = useSuspenseQuery(
    healthRecordsListOptions({
      horseId,
    })
  );
  const createHealthRecordMutation = useCreateHealthRecordMutation(horseId);

  const handleAddHealthRecord = () => {
    createHealthRecordMutation.mutate({
      horseId,
      eventDate: Date.now(),
      eventType: "Check-up",
      description: "Routine check-up",
      veterinarian: "Dr. Smith",
    });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Health Records</h1>
        <Button onClick={handleAddHealthRecord} className="mb-4">
          Add Health Record
        </Button>
        <ul>
          {data.map((record) => (
            <li key={record.healthRecordId} className="mb-2">
              <strong>{formatDate(record.eventDate)}</strong>:{" "}
              {record.eventType} - {record.description} (Veterinarian:{" "}
              {record.veterinarian})
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { useUpdateHorseMutation } from "@/query/mutations/horses";
import { horseDetailsOptions } from "@/query/options/horses";

export const Route = createFileRoute("/horses/$horseId/")({
  component: HorseDetailsComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      horseDetailsOptions({
        horseId: opts.params.horseId,
      })
    );
  },
});

function HorseDetailsComponent() {
  const { horseId } = Route.useParams();
  const { data: horse } = useSuspenseQuery(
    horseDetailsOptions({
      horseId,
    })
  );
  const updateHorseMutation = useUpdateHorseMutation(horseId);

  const handleEditHorse = () => {
    // Logic to edit horse details
  };

  const handleLogHealth = () => {
    // Logic to log health information
  };

  const handleUpdateFeedingSchedule = () => {
    // Logic to update feeding schedule
  };

  const handleRecordExercise = () => {
    // Logic to record exercise/training session
  };

  const handleDeleteHorse = () => {
    // Logic to delete horse profile
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="text-2xl font-bold">{horse.name}</h1>
        <div className="mt-4 flex items-center">
          <img
            src={horse.profilePicture}
            alt={`${horse.name} Profile`}
            className="mr-4 h-32 w-32 rounded-full"
          />
          <div>
            <p>
              <strong>Breed:</strong> {horse.breed}
            </p>
            <p>
              <strong>Age:</strong> {horse.age}
            </p>
            <p>
              <strong>Owner:</strong> {horse.ownerId}
            </p>
            <p>
              <strong>Current Stall:</strong> {horse.stallId}
            </p>
            <p>
              <strong>Special Care Instructions:</strong> {horse.specialNeeds}
            </p>
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <Button onClick={handleEditHorse}>Edit Profile</Button>
          <Button onClick={handleDeleteHorse} variant="destructive">
            Delete Profile
          </Button>
        </div>
      </Panel>

      <Panel className="p-4">
        <h2 className="text-xl font-bold">Health Information</h2>
        <ul className="mt-2">
          {horse.healthRecords.map((record) => (
            <li key={record.healthRecordId}>
              <strong>{formatDate(record.eventDate)}:</strong>{" "}
              {record.description}
            </li>
          ))}
        </ul>
        <Button onClick={handleLogHealth} className="mt-2">
          Log Health Information
        </Button>
      </Panel>

      <Panel className="p-4">
        <h2 className="text-xl font-bold">Feeding Schedule</h2>
        <ul className="mt-2">
          {horse.feedingSchedules.map((schedule) => (
            <li key={schedule.feedingScheduleId}>
              <strong>{schedule.dayOfWeek}:</strong> {schedule.feedType} -{" "}
              {schedule.quantity} {schedule.unitOfMeasurement}
            </li>
          ))}
        </ul>
        <Button onClick={handleUpdateFeedingSchedule} className="mt-2">
          Update Feeding Schedule
        </Button>
      </Panel>

      <Panel className="p-4">
        <h2 className="text-xl font-bold">Exercise & Training</h2>
        <ul className="mt-2">
          {horse.exerciseLogs.map((log) => (
            <li key={log.exerciseLogId}>
              <strong>{formatDate(log.date)}:</strong> {log.type} -{" "}
              {log.duration} minutes
            </li>
          ))}
        </ul>
        <Button onClick={handleRecordExercise} className="mt-2">
          Record Exercise/Training Session
        </Button>
      </Panel>

      <Panel className="p-4">
        <h2 className="text-xl font-bold">Documents</h2>
        <ul className="mt-2">
          {horse.documents.map((doc) => (
            <li key={doc.documentUrl}>
              <a
                href={doc.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {doc.description}
              </a>
            </li>
          ))}
        </ul>
        <Button className="mt-2">Upload New Document</Button>
      </Panel>
    </div>
  );
}

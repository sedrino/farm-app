import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import { useUpdateMaintenanceRequestMutation } from "@/query/mutations/maintenance-requests";
import { maintenanceRequestOptions } from "@/query/options/maintenance-requests";

export const Route = createFileRoute("/maintenance-requests/$requestId/")({
  component: MaintenanceRequestDetailsComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      maintenanceRequestOptions({
        requestId: opts.params.requestId,
      })
    );
  },
});

function MaintenanceRequestDetailsComponent() {
  const { requestId } = Route.useParams();
  const { data: request } = useSuspenseQuery(
    maintenanceRequestOptions({
      requestId,
    })
  );
  const updateRequestMutation = useUpdateMaintenanceRequestMutation(requestId);

  const handleStatusChange = (status: string) => {
    updateRequestMutation.mutate({
      status,
    });
  };

  const handleAssignStaff = (staffId: string) => {
    updateRequestMutation.mutate({
      assignedStaffId: staffId,
    });
  };

  const handleCommentChange = (comments: string) => {
    updateRequestMutation.mutate({
      comments,
    });
  };

  const handleCloseRequest = () => {
    updateRequestMutation.mutate({
      status: "closed",
      completionDate: Date.now(),
    });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Maintenance Request Details</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Request Information</h2>
          <p>
            <strong>Title:</strong> {request.title}
          </p>
          <p>
            <strong>Description:</strong> {request.description}
          </p>
          <p>
            <strong>Location:</strong> {request.location}
          </p>
          <p>
            <strong>Priority:</strong> {request.priority}
          </p>
          <p>
            <strong>Status:</strong> {request.status}
          </p>
          <p>
            <strong>Assigned Staff:</strong>{" "}
            {request.assignedStaffId ? request.assignedStaffId : "Not assigned"}
          </p>
          <p>
            <strong>Submission Date:</strong>{" "}
            {formatDate(request.submissionDate)}
          </p>
          <p>
            <strong>Completion Date:</strong>{" "}
            {request.completionDate
              ? formatDate(request.completionDate)
              : "N/A"}
          </p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">Comments/Updates</h2>
          <Textarea
            value={request.comments}
            onChange={(e) => handleCommentChange(e.target.value)}
            placeholder="Add comments or updates"
          />
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={() => handleStatusChange("in_progress")}
            variant="outline"
          >
            Mark as In Progress
          </Button>
          <Button
            onClick={() => handleStatusChange("completed")}
            variant="outline"
          >
            Mark as Completed
          </Button>
          <Button onClick={() => handleCloseRequest()} variant="outline">
            Close Request
          </Button>
          <Button
            onClick={() => handleAssignStaff("staffId")}
            variant="outline"
          >
            Assign Staff
          </Button>
          <Button variant="destructive">Delete Request</Button>
        </div>
      </Panel>
    </div>
  );
}

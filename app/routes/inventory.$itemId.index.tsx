import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import { useDeleteInventoryItemMutation } from "@/query/mutations/inventory-items";
import { inventoryItemOptions } from "@/query/options/inventory-items";

export const Route = createFileRoute("/inventory/$itemId/")({
  component: InventoryItemDetailsComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      inventoryItemOptions({
        itemId: opts.params.itemId,
      })
    );
  },
});

function InventoryItemDetailsComponent() {
  const { itemId } = Route.useParams();
  const { data } = useSuspenseQuery(
    inventoryItemOptions({
      itemId,
    })
  );

  const deleteInventoryItemMutation = useDeleteInventoryItemMutation(itemId);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteInventoryItemMutation.mutate();
    }
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Inventory Item Details</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{data.name}</h2>
          <p>Category: {data.category}</p>
          <p>Quantity: {data.quantity}</p>
          <p>Unit: {data.unit}</p>
          <p>Reorder Point: {data.reorderPoint}</p>
          <p>Description: {data.description}</p>
          <p>Supplier: {data.supplier}</p>
          <p>Last Updated: {formatDate(data.updatedAt)}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Usage History</h2>
          {/* Placeholder for usage history graph */}
          <div className="h-40 w-full rounded border border-gray-300">
            Usage History Graph
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Reorder History</h2>
          <ul>
            {data.reorderHistory.map((reorder) => (
              <li key={reorder.reorderHistoryId}>
                <p>
                  Date: {formatDate(reorder.date)} - Quantity:{" "}
                  {reorder.quantity}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            Related Maintenance Requests
          </h2>
          <ul>
            {data.maintenanceRequests.map((request) => (
              <li key={request.maintenanceRequestId}>
                <p>
                  Title: {request.title} - Status: {request.status}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex space-x-2">
          <Button variant="default">Edit</Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Panel>
    </div>
  );
}

import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useDeleteInventoryItemMutation } from "@/query/mutations/inventory-items";
import { inventoryItemOptions } from "@/query/options/inventory-items";

export const Route = createFileRoute(
  "/farm-operations/inventory/items/$itemId/"
)({
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

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Inventory Item Details</h1>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl">{data.name}</h2>
            <p>{data.description}</p>
            {data.imageUrl && <img src={data.imageUrl} alt={data.name} />}
          </div>
          <div className="flex space-x-2">
            <Button variant="default">Edit</Button>
            <AdjustQuantityButton itemId={itemId} />
            <DeleteInventoryItemButton itemId={itemId} />
          </div>
        </div>
        <div>
          <h3 className="text-lg">Usage History</h3>
          {/* Placeholder for usage history graph */}
          <div className="h-40 w-full bg-gray-200"></div>
        </div>
        <div>
          <h3 className="text-lg">Recent Transactions</h3>
          {/* Placeholder for recent transactions log */}
          <ul>
            <li>Addition - 10 units on 2023-01-01</li>
            <li>Depletion - 5 units on 2023-01-02</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg">Notes</h3>
          <p>{data.notes}</p>
        </div>
      </Panel>
    </div>
  );
}

function AdjustQuantityButton({ itemId }: { itemId: string }) {
  return <Button variant="outline">Adjust Quantity</Button>;
}

function DeleteInventoryItemButton({ itemId }: { itemId: string }) {
  const deleteInventoryItemMutation = useDeleteInventoryItemMutation(itemId);
  return (
    <Button
      variant="destructive"
      onClick={() => deleteInventoryItemMutation.mutate()}
    >
      Delete
    </Button>
  );
}

import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { PastureMap } from "@/components/ui/pasture-map";
import { PastureTable } from "@/components/ui/pasture-table";
import { useStartNewRotationMutation } from "@/query/mutations/pasture-rotations";
import { pasturesListOptions } from "@/query/options/pastures";

const pastureRotationSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
});

export const Route = createFileRoute("/pasture-rotation/")({
  component: PastureRotationComponent,
  validateSearch: zodSearchValidator(pastureRotationSearchSchema),
  loaderDeps: ({ search: { page, pageSize } }) => ({ page, pageSize }),
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      pasturesListOptions({
        page: opts.deps.page,
        pageSize: opts.deps.pageSize,
      })
    );
  },
});

function PastureRotationComponent() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(
    pasturesListOptions({
      page: search.page,
      pageSize: search.pageSize,
    })
  );

  const startNewRotationMutation = useStartNewRotationMutation();

  const handleStartNewRotation = () => {
    startNewRotationMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Pasture Rotation</h1>
        <div className="mb-4 flex items-center justify-between">
          <Button variant="default" onClick={handleStartNewRotation}>
            Start New Rotation
          </Button>
          <Button variant="default">Plan Rotation</Button>
        </div>
        <PastureMap pastures={data} />
        <PastureTable pastures={data} />
      </Panel>
      <aside className="w-64 p-4">
        <h2 className="text-xl font-bold">Pasture Health Tips</h2>
        <ul>
          <li>Rotate pastures every 4-6 weeks to maintain grass health.</li>
          <li>
            Monitor soil quality and adjust rotation schedules accordingly.
          </li>
          <li>Provide shade and water access in all pastures.</li>
        </ul>
      </aside>
    </div>
  );
}

import { useCallback } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";

import BasicForm from "@/components/form/basic-form";
import { Panel } from "@/components/ui/panel";
import { useCreatePersonMutation } from "@/examples/mutations";
import { personQuery } from "@/examples/query-options";

export const Route = createFileRoute("/_auth/dev/examples/basic-form-edit")({
  component: BasicFormComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(personQuery);
  },
});
// AI generated code
const schema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  age: z.number(),
  visits: z.number(),
  status: z.string().min(1, "Status is required"),
  isPublic: z.boolean().default(false),
});
const fieldSelectArrayMap = {
  status: ["Single", "Complicated", "In Relationship"],
};
//
function BasicFormComponent() {
  // AI generated code
  const successFunction = useCallback(() => {
    console.log("success");
    toast.success("Success");
  }, []);
  const createPersonMutation = useCreatePersonMutation();
  const { data } = useSuspenseQuery(personQuery);
  const formDefaults = schema.parse(data);
  //
  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <BasicForm
          //data could come from query etc but this is setting defaults
          data={formDefaults}
          schema={schema}
          title={"Basic Form"}
          fieldSelectArrayMap={fieldSelectArrayMap}
          mutation={createPersonMutation}
          successFunction={successFunction}
        />
      </Panel>
    </div>
  );
}

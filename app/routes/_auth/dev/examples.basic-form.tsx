import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/ui/panel";
import BasicForm from "@/components/form/basic-form";
import { z } from "zod";
import { useCreatePersonMutation } from "@/examples/mutations";
import { toast } from "sonner";
import { useCallback } from "react";
export const Route = createFileRoute("/_auth/dev/examples/basic-form")({
  component: BasicFormComponent,
});
// AI generated code
const schema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  age: z.number(),
  visits: z.number(),
  status: z.string().min(1, "Status is required"),
  isPublic: z.boolean(),
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
  const data = {
    firstName: "",
    age: undefined,
    visits: undefined,
    status: "",
    isPublic: false,
  };
  //
  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <BasicForm
          //data could come from query etc but this is setting defaults
          data={data}
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

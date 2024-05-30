import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/ui/panel";
import { peopleQuery } from "@/examples/query-options";
import BasicForm from "@/components/form/basic-form";
import { z } from "zod";
import { createPersonMutation } from "@/examples/mutations";
import { toast } from "sonner";
export const Route = createFileRoute("/_auth/dev/examples/basic-form")({
  component: () => <BasicTableComponent />,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(peopleQuery);
  },
});

function BasicTableComponent() {

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

  function successFunction(){
    console.log("success");
    toast.success("Success");
  } 
  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <BasicForm
          data={{
            firstName: "John",
            age: 20,
            visits: 10,
            status: "Single",
            isPublic: true,
          }}
          schema={schema}
          title={"Basic Form"}
          fieldSelectArrayMap={fieldSelectArrayMap}
          mutation={createPersonMutation()}
          successFunction={successFunction}
        />
      </Panel>
    </div>
  );
}

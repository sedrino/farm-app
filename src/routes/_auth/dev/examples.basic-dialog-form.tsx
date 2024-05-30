import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/ui/panel";
import { peopleQuery } from "@/examples/query-options";
import BasicForm from "@/components/form/basic-form";
import { z } from "zod";
import { createPersonMutation } from "@/examples/mutations";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export const Route = createFileRoute("/_auth/dev/examples/basic-dialog-form")({
  component: () => <BasicFormComponent />,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(peopleQuery);
  },
});

function BasicFormComponent() {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
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

  function successFunction() {
    console.log("success");
    setDialogIsOpen(false)
    toast.success("Success");
  }
  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <Dialog onOpenChange={()=>{setDialogIsOpen(!dialogIsOpen)}} open={dialogIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Edit Profile</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <BasicForm
              data={{
                firstName: "",
                age: undefined,
                visits: undefined,
                status: "",
                isPublic: false,
              }}
              schema={schema}
              title={"Basic Form"}
              fieldSelectArrayMap={fieldSelectArrayMap}
              mutation={createPersonMutation()}
              successFunction={successFunction}
            />
          </DialogContent>
        </Dialog>
      </Panel>
    </div>
  );
}

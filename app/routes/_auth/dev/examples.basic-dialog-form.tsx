import { useCallback, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";

import BasicForm from "@/components/form/basic-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Panel } from "@/components/ui/panel";
import { useCreatePersonMutation } from "@/examples/mutations";

export const Route = createFileRoute("/_auth/dev/examples/basic-dialog-form")({
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
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  // AI generated code
  const successFunction = useCallback(() => {
    console.log("success");
    setDialogIsOpen(false);
    toast.success("Success");
  }, [setDialogIsOpen]);
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
        <Dialog
          open={dialogIsOpen}
          onOpenChange={() => {
            setDialogIsOpen(!dialogIsOpen);
          }}
        >
          <DialogTrigger asChild>
            <Button variant="outline">Edit Profile</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <BasicForm
              data={data}
              schema={schema}
              title={"Basic Form in Dialog"}
              fieldSelectArrayMap={fieldSelectArrayMap}
              mutation={createPersonMutation}
              successFunction={successFunction}
            />
          </DialogContent>
        </Dialog>
      </Panel>
    </div>
  );
}

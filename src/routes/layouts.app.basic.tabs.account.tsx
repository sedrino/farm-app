import { InputContainer, TwoColumn } from "@/components/ui/grid";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@/lib/form";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { Button } from "@/components/ui/button";
import { FormSubmitButton } from "@/components/form/submit";

export const Route = createFileRoute("/layouts/app/basic/tabs/account")({
  component: PageComponent,
});

export function PageComponent() {
  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });
  return (
    <>
      <Panel>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <TwoColumn className="px-8 py-8">
            <TwoColumn.Left>
              <label className="text-foreground col-span-12 text-sm lg:col-span-5 ">
                Account settings
              </label>
            </TwoColumn.Left>
            <TwoColumn.Right>
              <InputContainer
                label={
                  <InputContainer.Label>Organization name</InputContainer.Label>
                }
              >
                <form.Field
                  name="name"
                  validators={{
                    onChange: z.string().min(4),
                  }}
                  children={(field) => (
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                />
              </InputContainer>
              <form.Field
                name="slug"
                validators={{
                  onChange: z.string().min(1),
                }}
              >
                {(field) => (
                  <InputContainer
                    label={
                      <InputContainer.Label>
                        Organization slug
                      </InputContainer.Label>
                    }
                  >
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </InputContainer>
                )}
              </form.Field>
            </TwoColumn.Right>
          </TwoColumn>
          <Panel.Divider />
          {/* <Panel.Section>

          </Panel.Section> */}
          <div className="flex px-8 py-4">
            <div className="flex w-full items-center justify-end gap-2">
              <div className="flex items-center gap-2">
                <Button variant={"ghost"} onClick={() => form.reset()}>
                  Cancel
                </Button>
                <FormSubmitButton form={form}></FormSubmitButton>
              </div>
            </div>
          </div>
        </form>
      </Panel>
    </>
  );
}

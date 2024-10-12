import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { FormSubmitButton } from "@/components/form/submit";
import { Button } from "@/components/ui/button";
import { InputContainer, TwoColumn } from "@/components/ui/grid";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { orgNameQueryOptions } from "@/examples/query-options";
import { useForm } from "@/lib/form";

export const Route = createFileRoute("/_auth/dev/examples/settings/account")({
  component: PageComponent,
  loader: async (opts) => {
    return opts.context.queryClient.ensureQueryData(orgNameQueryOptions());
  },
});
export function PageComponent() {
  const data = Route.useLoaderData();
  const {} = Route.useLoaderDeps();
  const form = useForm({
    defaultValues: {
      name: data?.name ?? "",
      slug: data?.slug ?? "",
    },
    onSubmit: (values) => {
      console.log(values);
      Route.router?.invalidate();
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
              <label className="col-span-12 text-sm text-foreground lg:col-span-5">
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

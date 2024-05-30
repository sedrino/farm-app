import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { UseMutationResult } from "@tanstack/react-query";
import { FormSubmitButton } from "./submit";
import { BasicInput } from "./basic-input";
import { toast } from "sonner";

export default function BasicForm<TFormData>(props: {
  data: TFormData;
  mutation: UseMutationResult<any, unknown, any, unknown>;
  schema: z.ZodObject<any>;
  title: string;
  fieldSelectArrayMap: { [key: string]: string[] };
  successFunction?: () => void;
}) {
  const schemaShape = props.schema.shape;

  const form = useForm({
    defaultValues: props.data,
    onSubmit: async ({ value }) => {
        try{
            await props.mutation.mutateAsync(value);
            if(props.successFunction){
                props.successFunction();
            }
        }catch(e){
            console.log(e);
            toast.error("An error occurred");
        }

    },
    validatorAdapter: zodValidator,
  });

  return (
    <div>
      <h1>{props.title}</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div className="flex flex-col space-y-2">
          {Object.keys(schemaShape).map((key, index) => {
            let fieldType = schemaShape[key]._def.typeName;
            const selectOptions = props.fieldSelectArrayMap[key];
            if(selectOptions){
                fieldType = "Select";
            }
            return (
              <form.Field
                key={key + index}
                name={key as keyof TFormData}
                validators={{
                  onChange: schemaShape[key],
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: schemaShape[key],
                }}
                children={(field) => {
                  return (
                    <BasicInput
                      field={field}
                      label={key}
                      type={fieldType}
                      selectOptions={selectOptions}
                    />
                  );
                }}
              />
            );
          })}
        </div>

        <FormSubmitButton form={form} />
      </form>
    </div>
  );
}

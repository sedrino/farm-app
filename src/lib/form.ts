import { createFormFactory } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";

const formFactory = createFormFactory({
  validatorAdapter: zodValidator,
});

export const useForm = formFactory.useForm;

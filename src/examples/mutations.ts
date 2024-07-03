import { useMutation } from "@tanstack/react-query";
export type Person = {
  firstName: string;
  age: number;
  visits: number;
  status: string;
  isPublic: boolean;
};
export function useCreatePersonMutation() {
  return useMutation({
    mutationFn: async (data: Person) => {
      console.log("data", data);
      return true;
    },
    onSuccess: (data, variables) => {
      console.log("invalidate queries", data);
    },
  });
}

import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@/lib/form";
import { z } from "zod";
import reactLogo from "@/assets/react.svg";
import viteLogo from "@/assets/vite.svg";
import { useQuery, useMutation } from "@tanstack/react-query";
import { client } from "@/query/client";
import { InferRequestType } from "hono/client";

export const Route = createFileRoute("/_auth/home")({
  component: Home,
});

function Home() {
  const form = useForm({
    defaultValues: {
      name: "",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      const rv = await mutation.mutateAsync({
        id: Date.now().toString(),
        name: value.name as string,
      });
      console.log(rv);
    },
  });

  const { data } = useQuery({
    queryKey: ["hello"],
    queryFn: async () => {
      const res = await client.users.hello.$get({ query: { name: "world" } });
      return await res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (
      data: InferRequestType<typeof client.users.name.$post>["form"]
    ) => {
      const res = await client.users.name.$post({ form: data });
      return await res.json();
    },
    onSuccess: () => {
      alert("success");
    },
    onError: (error) => {
      alert(error);
    },
  });
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex">
        <div className="p-4 m-2">
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
        </div>
        <div className="p-4 m-2">
          <a href="https://vitejs.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
      </div>
      <div className="flex">
        <div>
          <h1>{data?.message}</h1>
          <h1>Post something to server</h1>
        </div>
      </div>
      <div className="flex mt-2">
        <form
          className="max-w-lg space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <form.Field
            name="name"
            validators={{
              onChange: z.string().min(3, "Name must be at least 3 characters"),
            }}
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                  <Label htmlFor={field.name}>Name:</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e: any) => field.handleChange(e.target?.value)}
                  />
                </>
              );
            }}
          />
          <Button type="submit">Click me</Button>
        </form>
      </div>
    </div>
  );
}

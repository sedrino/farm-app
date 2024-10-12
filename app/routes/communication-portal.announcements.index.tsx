import React from "react";
import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/query/client";
import {
  announcementsListOptions,
  useCreateAnnouncementMutation,
} from "@/query/mutations/announcements";

export const Route = createFileRoute("/communication-portal/announcements/")({
  component: AnnouncementsPageComponent,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      announcementsListOptions({
        page: 1,
        pageSize: 100,
      })
    );
  },
});

const announcementFormSchema = z.object({
  announcement: z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    scheduledAt: z.number().optional(),
    targetGroup: z.array(z.string()).optional(),
  }),
});

function AnnouncementsPageComponent() {
  const { data: announcements } = useSuspenseQuery(
    announcementsListOptions({
      page: 1,
      pageSize: 100,
    })
  );
  const createAnnouncementMutation = useCreateAnnouncementMutation();

  const form = useForm({
    defaultValues: {
      announcement: {
        title: "",
        content: "",
        scheduledAt: undefined,
        targetGroup: [],
      },
    } as z.infer<typeof announcementFormSchema>,
    onSubmit: async ({ value }) => {
      await createAnnouncementMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    validatorAdapter: zodValidator(),
  });

  return (
    <div className="flex flex-col gap-4 p-8">
      <Panel className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Announcements</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="announcement.title"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-2 text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          />

          <form.Field
            name="announcement.content"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Content
                </label>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-2 text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          />

          <form.Field
            name="announcement.scheduledAt"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Scheduled At
                </label>
                <Input
                  id={field.name}
                  type="datetime-local"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(new Date(e.target.value).getTime())
                  }
                />
              </div>
            )}
          />

          <form.Field
            name="announcement.targetGroup"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Target Group
                </label>
                <Input
                  id={field.name}
                  value={field.state.value?.join(", ")}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value.split(", "))
                  }
                />
              </div>
            )}
          />

          <div className="flex space-x-2">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "..." : "Create Announcement"}
                </Button>
              )}
            />
          </div>
        </form>

        <div className="mt-8">
          <h2 className="text-xl font-bold">Past Announcements</h2>
          <ul>
            {announcements?.map((announcement) => (
              <li key={announcement.announcementId}>
                <h3 className="font-semibold">{announcement.title}</h3>
                <p>{announcement.content}</p>
              </li>
            ))}
          </ul>
        </div>
      </Panel>
    </div>
  );
}

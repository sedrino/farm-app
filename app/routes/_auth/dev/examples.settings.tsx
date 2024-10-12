import { createFileRoute } from "@tanstack/react-router";

import { Content } from "@/components/ui/layouts/content";
import { PageHeader } from "@/components/ui/layouts/page-header";
import { LinkTabs } from "@/components/ui/link-tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { pageBreadcrumb, pageTitle } from "@/components/ui/typography";

export const Route = createFileRoute("/_auth/dev/examples/settings")({
  component: () => (
    <main className="flex h-full w-full flex-1 flex-col overflow-x-hidden">
      <PageHeader>
        <h1 className={pageBreadcrumb()}>Tabs Example</h1>
      </PageHeader>
      <ScrollArea>
        <div className="flex-1 flex-grow overflow-y-auto">
          {" "}
          <Content position="center" size="md">
            <h1 className={pageTitle()}>Settings</h1>
            <LinkTabs.Root>
              <LinkTabs.List>
                <LinkTabs.Trigger
                  to={"/dev/examples/settings/account"}
                  from={Route.fullPath}
                >
                  Account
                </LinkTabs.Trigger>
                <LinkTabs.Trigger
                  to={"/dev/examples/settings/password"}
                  from={Route.fullPath}
                >
                  Password
                </LinkTabs.Trigger>
              </LinkTabs.List>
              <LinkTabs.Outlet />
            </LinkTabs.Root>

            <div className="mt-20"></div>
          </Content>
        </div>
      </ScrollArea>
    </main>
  ),
});

import { Content } from "@/components/ui/layouts/content";
import { PageHeader } from "@/components/ui/layouts/page-header";
import { pageBreadcrumb, pageTitle } from "@/components/ui/typography";
import { createFileRoute } from "@tanstack/react-router";
import { LinkTabs } from "@/components/ui/link-tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Route = createFileRoute("/_auth/dev/examples/settings")({
  component: () => (
    <main className="h-full flex flex-col flex-1 w-full overflow-x-hidden">
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

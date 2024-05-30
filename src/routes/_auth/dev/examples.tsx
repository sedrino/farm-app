import { Outlet, createFileRoute } from "@tanstack/react-router";
import {
  SimpleLeftMenuLayout,
  SimpleVerticalNavSection,
  SimpleNavLink,
} from "@/components/layouts/simple-left-menu-layout";
import { Separator } from "@radix-ui/react-dropdown-menu";
export const Route = createFileRoute("/_auth/dev/examples")({
  component: () => <PageListComponent />,
});
export function PageListComponent() {
  return (
    <SimpleLeftMenuLayout
      sideNav={
        <>
          <SimpleLeftMenuLayout.Header>
            <h4 className="text-lg">Examples</h4>
          </SimpleLeftMenuLayout.Header>
          <SimpleLeftMenuLayout.ScrollArea>
            <SimpleVerticalNavSection title="Tables">
              <SimpleNavLink to={"/dev/examples/basic-table"}>
                Basic
              </SimpleNavLink>
              <SimpleNavLink to={"/dev/examples/data-table"}>
                Data Table
              </SimpleNavLink>
            </SimpleVerticalNavSection>
            <SimpleVerticalNavSection title="Forms">
              <SimpleNavLink to={"/dev/examples/basic-form"}>
                Basic
              </SimpleNavLink>
            </SimpleVerticalNavSection>
            <Separator />
            <SimpleVerticalNavSection title="Settings">
              <SimpleNavLink to={"/dev/examples/settings/account"}>
                Account
              </SimpleNavLink>
            </SimpleVerticalNavSection>
            <Separator />
          </SimpleLeftMenuLayout.ScrollArea>
        </>
      }
      content={
        <>
          <Outlet />
        </>
      }
    />
  );
}

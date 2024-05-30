import { DashboardLayout1 as Layout } from "@/components/layouts/dashboard-layout-1";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Table } from "lucide-react";
import { Toaster } from "@/components/ui/sonner"
export const Route = createFileRoute("/_auth/dev")({
  component: DevLayout,
});
export function DevLayout() {
  return (
    <Layout
      sideNav={
        <Layout.LeftSideNav
          topNav={
            <>
              <Layout.NavLink icon={<Table />} linkProps={{ to: "/dev/pages" }}>
                Page List
              </Layout.NavLink>
              <Layout.NavLink
                icon={<Table />}
                linkProps={{ to: "/dev/examples" }}
              >
                Examples
              </Layout.NavLink>
            </>
          }
        />
      }
    >
      <Outlet />
      <Toaster />
    </Layout>
  );
}

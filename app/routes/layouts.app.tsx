import { DashboardLayout1 as Layout } from "@/components/layouts/dashboard-layout-1";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Table } from "lucide-react";
export const Route = createFileRoute("/layouts/app")({
  component: () => (
    <Layout
      sideNav={
        <Layout.LeftSideNav
          topNav={
            <>
              <Layout.NavLink icon={<Table />} to="/layouts/app">
                Link
              </Layout.NavLink>
              <Layout.NavLink icon={<Table />} to="/">
                Link
              </Layout.NavLink>
              <Layout.NavLink icon={<Table />} to="/">
                Link
              </Layout.NavLink>
              <Layout.NavLink icon={<Table />} to="/">
                Link
              </Layout.NavLink>
            </>
          }
        />
      }
    >
      <Outlet />
    </Layout>
  ),
});

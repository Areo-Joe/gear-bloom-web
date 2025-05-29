import * as React from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Layout } from "../components/layout";

// 只在开发环境中包含DevTools
const isDev = import.meta.env.DEV;

export const Route = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
      {isDev && <TanStackRouterDevtools />}
    </Layout>
  ),
});

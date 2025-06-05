import * as React from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

// 只在开发环境中包含DevTools
const isDev = import.meta.env.DEV;

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      {isDev && <TanStackRouterDevtools />}
    </>
  ),
});

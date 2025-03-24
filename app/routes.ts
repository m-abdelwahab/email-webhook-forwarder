import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/servers/:serverId/settings", "routes/server-settings.tsx"),
  route("/sign-in/*", "routes/auth/sign-in.tsx"),
  route("/sign-up/*", "routes/auth/sign-up.tsx"),
] satisfies RouteConfig;

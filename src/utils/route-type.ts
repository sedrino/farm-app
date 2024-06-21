// Do not alter this file it is used to gather type information about routes.
import { routeTree } from "@/routeTree.gen";

type TempRoute = {
  types: RouteNode;
};

type RouteNode = {
  to: string;
  searchSchemaInput?: any;
  allParams?: any;
  fullSearchSchemaInput?: any;
  children?: Record<string, TempRoute> | unknown;
};

type RootRoute = typeof routeTree;

type GetChildren<T extends TempRoute> = T["types"]["children"] extends Record<
  string,
  TempRoute
>
  ? T["types"]["children"]
  : never;

type RootChildren = GetChildren<RootRoute>;
type t = GetChildren<RootChildren["IndexRoute"]>;

type FlattenRoutes<T extends TempRoute> =
  | T["types"]
  | (GetChildren<T> extends never
      ? never
      : {
          [K in keyof GetChildren<T>]: FlattenRoutes<GetChildren<T>[K]>;
        }[keyof GetChildren<T>]);

type AllRoutes = FlattenRoutes<RootRoute>;

type ExtractTo<T> = T extends { to: infer R } ? R : never;
type ExtractSearchSchemaInput<T, U> = T extends {
  to: U;
  searchSchemaInput: infer S;
}
  ? S
  : never;
type ExtractAllParams<T, U> = T extends { to: U; allParams: infer S }
  ? S
  : never;
type ExtractFullSearchSchemaInput<T, U> = T extends {
  to: U;
  fullSearchSchemaInput: infer S;
}
  ? S
  : never;

type RouteKeys = ExtractTo<AllRoutes>;

export type RouteInfo = {
  [K in RouteKeys]: {
    fullPath: K;
    searchSchemaInput: ExtractSearchSchemaInput<AllRoutes, K>;
    allParams: ExtractAllParams<AllRoutes, K>;
    fullSearchSchemaInput: ExtractFullSearchSchemaInput<AllRoutes, K>;
  };
};

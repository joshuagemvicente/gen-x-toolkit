/**
 * Public surface of `@repo/contracts`.
 *
 * Every schema in this package is defined once and consumed by both sides of
 * the HTTP boundary: the API validates incoming data with it, the web app
 * derives its types from it. Never redeclare one of these shapes locally.
 */
export * from "./api-error";
export * from "./greeting";
export * from "./health";

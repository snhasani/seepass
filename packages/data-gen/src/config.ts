export const SEED = parseInt(process.env.SEED || "42", 10);

export const SURFACES = [
  "/checkout",
  "/pdp",
  "/cart",
  "/payment",
  "/shipping",
  "/order-confirm",
  "/search",
] as const;

export type Surface = (typeof SURFACES)[number];

export const RELEASE_VERSIONS = [
  "web@1.40.0",
  "web@1.41.2",
  "web@1.42.0",
  "web@1.42.1",
] as const;

export type ReleaseVersion = (typeof RELEASE_VERSIONS)[number];

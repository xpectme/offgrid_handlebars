// Workaround to get this to work with service workers
// deno-lint-ignore no-explicit-any
(globalThis as any).window = globalThis;

export * from "https://deno.land/x/offgrid_engine@v1.0.0/main.ts";
export { default as Handlebars } from "https://unpkg.com/handlebars@4.7.7/lib/handlebars.js";

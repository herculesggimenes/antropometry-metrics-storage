import { createTRPCRouter } from "./trpc";
import { resultsRouter } from "./routers/result";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  results: resultsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

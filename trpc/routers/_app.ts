import { createTRPCRouter } from '@/trpc/init';
import { exampleRouter } from './example';

/**
 * Main API Router Definition
 * Merges multiple sub-routers into a single router
 */
export const appRouter = createTRPCRouter({
  // Feature-specific routers
  example: exampleRouter,
  
  // Add more routers here as needed
  // user: userRouter,
  // post: postRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
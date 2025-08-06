import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/trpc/init';
import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';
import db from '@/src/db';
import { schema } from '@/src/db/client';
import { TRPCError } from '@trpc/server';

/**
 * Example API Router
 * Provides CRUD operations for the example table
 */
export const exampleRouter = createTRPCRouter({
  /**
   * Get all examples (public access)
   */
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const limit = input?.limit ?? 10;
      const offset = input?.offset ?? 0;

      try {
        const examples = await db
          .select()
          .from(schema.example)
          .orderBy(desc(schema.example.createdAt))
          .limit(limit)
          .offset(offset);

        return {
          success: true,
          data: examples,
        };
      } catch (error) {
        console.error('Error fetching examples:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch examples',
        });
      }
    }),

  /**
   * Get single example by ID (public access)
   */
  getById: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const [example] = await db
          .select()
          .from(schema.example)
          .where(eq(schema.example.id, input.id));

        if (!example) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Example not found',
          });
        }

        return {
          success: true,
          data: example,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error('Error fetching example:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch example',
        });
      }
    }),

  /**
   * Create new example (protected - requires authentication)
   */
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(255),
      description: z.string().optional(),
      status: z.enum(['draft', 'published', 'archived']).default('draft'),
      isActive: z.boolean().default(true),
      displayOrder: z.number().int().default(0),
      metadata: z.record(z.any()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const id = `example_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const [newExample] = await db
          .insert(schema.example)
          .values({
            id,
            ...input,
          })
          .returning();

        return {
          success: true,
          data: newExample,
        };
      } catch (error) {
        console.error('Error creating example:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create example',
        });
      }
    }),

  /**
   * Update example (protected - requires authentication)
   */
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(1).max(255).optional(),
      description: z.string().optional(),
      status: z.enum(['draft', 'published', 'archived']).optional(),
      isActive: z.boolean().optional(),
      displayOrder: z.number().int().optional(),
      metadata: z.record(z.any()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input;

      try {
        const [updatedExample] = await db
          .update(schema.example)
          .set({
            ...updateData,
            updatedAt: new Date(),
          })
          .where(eq(schema.example.id, id))
          .returning();

        if (!updatedExample) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Example not found',
          });
        }

        return {
          success: true,
          data: updatedExample,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error('Error updating example:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update example',
        });
      }
    }),

  /**
   * Delete example (protected - requires authentication)
   */
  delete: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const [deletedExample] = await db
          .delete(schema.example)
          .where(eq(schema.example.id, input.id))
          .returning();

        if (!deletedExample) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Example not found',
          });
        }

        return {
          success: true,
          data: deletedExample,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error('Error deleting example:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete example',
        });
      }
    }),
});
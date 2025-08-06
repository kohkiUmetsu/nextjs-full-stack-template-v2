import { createCallerFactory } from '@/trpc/init';
import { appRouter } from '@/trpc/routers/_app';
import db from '@/src/db';
import { SupabaseClient } from '@supabase/supabase-js';
import { getAuthFromHeaders } from '@/lib/auth-server';

// Mock getAuthFromHeaders
jest.mock('@/lib/auth-server');
const mockGetAuthFromHeaders = getAuthFromHeaders as jest.Mock;

jest.mock('@/src/db');
const mockDb = db as jest.Mocked<typeof db>;

const createCaller = () =>
  createCallerFactory(appRouter)({
    getSupabaseClient: async () => ({
      supabase: {} as SupabaseClient,
      session: null,
      userId: undefined,
    }),
  });

describe('appRouter.example', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all examples with default pagination', async () => {
      const mockExamples = [
        {
          id: 'example_1',
          title: 'Example 1',
          description: 'First example',
          status: 'published',
          isActive: true,
          displayOrder: 0,
          count: 0,
          metadata: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'example_2',
          title: 'Example 2',
          description: 'Second example',
          status: 'draft',
          isActive: true,
          displayOrder: 1,
          count: 0,
          metadata: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const selectMock = jest.fn().mockReturnThis();
      const fromMock = jest.fn().mockReturnThis();
      const orderByMock = jest.fn().mockReturnThis();
      const limitMock = jest.fn().mockReturnThis();
      const offsetMock = jest.fn().mockResolvedValue(mockExamples);

      mockDb.select.mockImplementation(() => ({
        from: fromMock,
      } as any));
      fromMock.mockImplementation(() => ({
        orderBy: orderByMock,
      }));
      orderByMock.mockImplementation(() => ({
        limit: limitMock,
      }));
      limitMock.mockImplementation(() => ({
        offset: offsetMock,
      }));

      const caller = createCaller();
      const result = await caller.example.getAll();

      expect(result).toEqual({
        success: true,
        data: mockExamples,
      });
      expect(limitMock).toHaveBeenCalledWith(10);
      expect(offsetMock).toHaveBeenCalledWith(0);
    });

    it('should fetch examples with custom pagination', async () => {
      const mockExamples = [{ id: 'example_1', title: 'Example 1' }];

      const selectMock = jest.fn().mockReturnThis();
      const fromMock = jest.fn().mockReturnThis();
      const orderByMock = jest.fn().mockReturnThis();
      const limitMock = jest.fn().mockReturnThis();
      const offsetMock = jest.fn().mockResolvedValue(mockExamples);

      mockDb.select.mockImplementation(() => ({
        from: fromMock,
      } as any));
      fromMock.mockImplementation(() => ({
        orderBy: orderByMock,
      }));
      orderByMock.mockImplementation(() => ({
        limit: limitMock,
      }));
      limitMock.mockImplementation(() => ({
        offset: offsetMock,
      }));

      const caller = createCaller();
      const result = await caller.example.getAll({ limit: 20, offset: 10 });

      expect(result).toEqual({
        success: true,
        data: mockExamples,
      });
      expect(limitMock).toHaveBeenCalledWith(20);
      expect(offsetMock).toHaveBeenCalledWith(10);
    });
  });

  describe('getById', () => {
    it('should fetch example by ID', async () => {
      const mockExample = {
        id: 'example_1',
        title: 'Example 1',
        description: 'First example',
        status: 'published',
        isActive: true,
        displayOrder: 0,
        count: 0,
        metadata: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const selectMock = jest.fn().mockReturnThis();
      const fromMock = jest.fn().mockReturnThis();
      const whereMock = jest.fn().mockResolvedValue([mockExample]);

      mockDb.select.mockImplementation(() => ({
        from: fromMock,
      } as any));
      fromMock.mockImplementation(() => ({
        where: whereMock,
      }));

      const caller = createCaller();
      const result = await caller.example.getById({ id: 'example_1' });

      expect(result).toEqual({
        success: true,
        data: mockExample,
      });
    });

    it('should throw NOT_FOUND error when example does not exist', async () => {
      const selectMock = jest.fn().mockReturnThis();
      const fromMock = jest.fn().mockReturnThis();
      const whereMock = jest.fn().mockResolvedValue([]);

      mockDb.select.mockImplementation(() => ({
        from: fromMock,
      } as any));
      fromMock.mockImplementation(() => ({
        where: whereMock,
      }));

      const caller = createCaller();

      await expect(caller.example.getById({ id: 'non_existent' })).rejects.toThrow(
        'Example not found'
      );
    });
  });

  describe('create (protected)', () => {
    it('should create new example when authenticated', async () => {
      // Mock authentication
      mockGetAuthFromHeaders.mockResolvedValue({
        supabase: {} as SupabaseClient,
        session: { user: { id: 'user_123' } },
        userId: 'user_123',
      });

      const newExample = {
        id: 'example_new',
        title: 'New Example',
        description: 'New description',
        status: 'draft',
        isActive: true,
        displayOrder: 0,
        count: 0,
        metadata: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const insertMock = jest.fn().mockReturnThis();
      const valuesMock = jest.fn().mockReturnThis();
      const returningMock = jest.fn().mockResolvedValue([newExample]);

      mockDb.insert.mockImplementation(() => ({
        values: valuesMock,
      } as any));
      valuesMock.mockImplementation(() => ({
        returning: returningMock,
      }));

      const caller = createCaller();
      const result = await caller.example.create({
        title: 'New Example',
        description: 'New description',
      });

      expect(result).toEqual({
        success: true,
        data: newExample,
      });
    });

    it('should throw UNAUTHORIZED when not authenticated', async () => {
      // Mock no authentication
      mockGetAuthFromHeaders.mockResolvedValue({
        supabase: {} as SupabaseClient,
        session: null,
        userId: undefined,
      });

      const caller = createCaller();

      await expect(
        caller.example.create({
          title: 'New Example',
        })
      ).rejects.toThrow('UNAUTHORIZED');
    });
  });

  describe('update (protected)', () => {
    it('should update example when authenticated', async () => {
      // Mock authentication
      mockGetAuthFromHeaders.mockResolvedValue({
        supabase: {} as SupabaseClient,
        session: { user: { id: 'user_123' } },
        userId: 'user_123',
      });

      const updatedExample = {
        id: 'example_1',
        title: 'Updated Example',
        description: 'Updated description',
        status: 'published',
        isActive: true,
        displayOrder: 0,
        count: 0,
        metadata: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateMock = jest.fn().mockReturnThis();
      const setMock = jest.fn().mockReturnThis();
      const whereMock = jest.fn().mockReturnThis();
      const returningMock = jest.fn().mockResolvedValue([updatedExample]);

      mockDb.update.mockImplementation(() => ({
        set: setMock,
      } as any));
      setMock.mockImplementation(() => ({
        where: whereMock,
      }));
      whereMock.mockImplementation(() => ({
        returning: returningMock,
      }));

      const caller = createCaller();
      const result = await caller.example.update({
        id: 'example_1',
        title: 'Updated Example',
        description: 'Updated description',
        status: 'published',
      });

      expect(result).toEqual({
        success: true,
        data: updatedExample,
      });
    });
  });

  describe('delete (protected)', () => {
    it('should delete example when authenticated', async () => {
      // Mock authentication
      mockGetAuthFromHeaders.mockResolvedValue({
        supabase: {} as SupabaseClient,
        session: { user: { id: 'user_123' } },
        userId: 'user_123',
      });

      const deletedExample = {
        id: 'example_1',
        title: 'Deleted Example',
      };

      const deleteMock = jest.fn().mockReturnThis();
      const whereMock = jest.fn().mockReturnThis();
      const returningMock = jest.fn().mockResolvedValue([deletedExample]);

      mockDb.delete.mockImplementation(() => ({
        where: whereMock,
      } as any));
      whereMock.mockImplementation(() => ({
        returning: returningMock,
      }));

      const caller = createCaller();
      const result = await caller.example.delete({ id: 'example_1' });

      expect(result).toEqual({
        success: true,
        data: deletedExample,
      });
    });
  });
});
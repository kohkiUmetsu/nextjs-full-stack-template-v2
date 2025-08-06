// Example status types
export type ExampleStatus = 'draft' | 'published' | 'archived';

// Example type definition
export interface Example {
  id: string;
  title: string;
  description?: string | null;
  status: ExampleStatus;
  isActive: boolean;
  displayOrder: number;
  count: number;
  metadata?: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

// Example create input type
export interface ExampleCreateInput {
  title: string;
  description?: string;
  status?: ExampleStatus;
  isActive?: boolean;
  displayOrder?: number;
  metadata?: Record<string, any>;
}

// Example update input type
export interface ExampleUpdateInput {
  id: string;
  title?: string;
  description?: string;
  status?: ExampleStatus;
  isActive?: boolean;
  displayOrder?: number;
  metadata?: Record<string, any>;
}

// Example search/filter parameters
export interface ExampleSearchParams {
  title?: string;
  status?: ExampleStatus;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'displayOrder';
  sortOrder?: 'asc' | 'desc';
}

// Example list result type
export interface ExampleListResult {
  examples: Example[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}
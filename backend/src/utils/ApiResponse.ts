import type { PaginationMeta } from "../types/index";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  pagination?: PaginationMeta;
}

export const ok = <T>(data: T, message = "OK", pagination?: PaginationMeta): ApiResponse<T> => ({
  success: true,
  data,
  message,
  pagination,
});

export const fail = (message: string, errors?: unknown) => ({
  success: false,
  message,
  errors,
});

"use client";

import { useQuery } from "@tanstack/react-query";
import { getDocuments } from "@/services/documents.service";
import type { ListDocumentsParams } from "@/types";

export const useDocuments = (params: ListDocumentsParams) => {
  const query = useQuery({
    queryKey: ["documents", params],
    queryFn: () => getDocuments(params),
  });

  return {
    items: query.data?.data ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch,
  };
};

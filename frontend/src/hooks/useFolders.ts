"use client";

import { useQuery } from "@tanstack/react-query";
import { getFolderContents, getRootFolders } from "@/services/folders.service";

export const useFolders = (parentId?: number) => {
  const query = useQuery({
    queryKey: ["folders", parentId ?? null],
    queryFn: async () => {
      if (parentId) {
        return getFolderContents(parentId);
      }
      return { 
        success: true, 
        data: { 
          currentFolder: null,
          folders: (await getRootFolders()).data, 
          documents: [] 
        }, 
        message: "OK" 
      };
    },
  });

  return {
    currentFolder: query.data?.data.currentFolder ?? null,
    folders: query.data?.data.folders ?? [],
    documents: query.data?.data.documents ?? [],
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch,
  };
};

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { fetchCVs, fetchCVDetail, uploadCVs, filterCVs, fetchStats, FilterPayload, CVListResponse, CVDetail, Stats, APIError } from '@/api/cvApi';
import { toast } from 'sonner';

// Query keys for better organization
export const cvKeys = {
  all: ['cvs'] as const,
  lists: () => [...cvKeys.all, 'list'] as const,
  list: (page: number) => [...cvKeys.lists(), page] as const,
  details: () => [...cvKeys.all, 'detail'] as const,
  detail: (id: number) => [...cvKeys.details(), id] as const,
  stats: () => ['stats'] as const,
};

// Custom hook for CV list with pagination
export function useCVs(page = 1, options?: Partial<UseQueryOptions<CVListResponse, APIError>>) {
  return useQuery<CVListResponse, APIError>({
    queryKey: cvKeys.list(page),
    queryFn: () => fetchCVs(page),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
}

// Custom hook for CV detail
export function useCVDetail(id: number, options?: Partial<UseQueryOptions<CVDetail, APIError>>) {
  return useQuery<CVDetail, APIError>({
    queryKey: cvKeys.detail(id),
    queryFn: () => fetchCVDetail(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
}

// Custom hook for uploading CVs
export function useUploadCVs() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: uploadCVs,
    onSuccess: (data) => {
      // Invalidate and refetch CV lists and stats
      queryClient.invalidateQueries({ queryKey: cvKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cvKeys.stats() });
      
      // Show success toast
      toast.success(`Successfully uploaded ${data.processed} of ${data.total} files`);
      
      // Show errors for failed uploads
      const failed = data.results.filter(r => !r.success);
      if (failed.length > 0) {
        failed.forEach(f => {
          toast.error(`Failed: ${f.name} - ${f.error}`);
        });
      }
    },
    onError: (error: APIError) => {
      toast.error(error.message || 'Upload failed. Please try again.');
    },
  });
}

// Custom hook for filtering CVs
export function useFilterCVs() {
  return useMutation({
    mutationFn: (payload: FilterPayload) => filterCVs(payload),
    onSuccess: (data) => {
      toast.success(`Found ${data.count} matching CV${data.count !== 1 ? 's' : ''}`);
    },
    onError: (error: APIError) => {
      toast.error(error.message || 'Filter failed. Please try again.');
    },
  });
}

// Custom hook for stats
export function useStats(options?: Partial<UseQueryOptions<Stats, APIError>>) {
  return useQuery<Stats, APIError>({
    queryKey: cvKeys.stats(),
    queryFn: fetchStats,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Auto-refetch every 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
}

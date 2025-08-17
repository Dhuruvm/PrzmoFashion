/**
 * Custom hook for handling async operations with proper loading and error states
 * Production-ready with proper error handling and cancellation support
 */
import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: React.DependencyList = [],
  options: UseAsyncOptions = {}
) {
  const { immediate = true, onSuccess, onError } = options;
  
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });
  
  const cancelRef = useRef<boolean>(false);
  const mountedRef = useRef<boolean>(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cancelRef.current = true;
    };
  }, []);

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    cancelRef.current = false;

    try {
      const data = await asyncFunction();
      
      if (!cancelRef.current && mountedRef.current) {
        setState({
          data,
          loading: false,
          error: null,
        });
        onSuccess?.(data);
      }
    } catch (error) {
      if (!cancelRef.current && mountedRef.current) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        setState({
          data: null,
          loading: false,
          error: errorObj,
        });
        onError?.(errorObj);
      }
    }
  }, dependencies);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  const cancel = useCallback(() => {
    cancelRef.current = true;
    setState(prev => ({ ...prev, loading: false }));
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset,
    cancel,
  };
}

// Specialized hook for API calls
export function useAsyncApi<T>(
  apiCall: () => Promise<Response>,
  dependencies: React.DependencyList = [],
  options: UseAsyncOptions = {}
) {
  const asyncFunction = useCallback(async (): Promise<T> => {
    const response = await apiCall();
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }
    
    return response.json();
  }, dependencies);

  return useAsync<T>(asyncFunction, dependencies, options);
}
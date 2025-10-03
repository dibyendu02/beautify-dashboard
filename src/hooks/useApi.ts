import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ApiOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useApi = <T = any>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (
    apiCall: () => Promise<any>,
    options: ApiOptions = {}
  ) => {
    const {
      showSuccessToast = false,
      showErrorToast = true,
      successMessage = 'Operation completed successfully',
      onSuccess,
      onError,
    } = options;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiCall();
      
      setState({
        data: response.data || response,
        loading: false,
        error: null,
      });

      if (showSuccessToast) {
        toast.success(successMessage);
      }

      if (onSuccess) {
        onSuccess(response.data || response);
      }

      return response.data || response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });

      if (showErrorToast) {
        toast.error(errorMessage);
      }

      if (onError) {
        onError(error);
      }

      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};

// Specialized hook for paginated data
export const usePaginatedApi = <T = any>() => {
  const [state, setState] = useState<{
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    loading: boolean;
    error: string | null;
  }>({
    data: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    loading: false,
    error: null,
  });

  const fetchPage = useCallback(async (
    apiCall: (page: number, limit: number) => Promise<any>,
    page: number = 1,
    limit: number = 10,
    options: ApiOptions = {}
  ) => {
    const { showErrorToast = true, onError } = options;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiCall(page, limit);
      
      setState({
        data: response.data || response.items || [],
        pagination: {
          page: response.pagination?.page || page,
          limit: response.pagination?.limit || limit,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
        },
        loading: false,
        error: null,
      });

      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      if (showErrorToast) {
        toast.error(errorMessage);
      }

      if (onError) {
        onError(error);
      }

      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    fetchPage,
    reset,
  };
};

// Hook for real-time data updates
export const useRealTimeApi = <T = any>(
  initialData: T[] = [],
  keyField: string = 'id'
) => {
  const [data, setData] = useState<T[]>(initialData);

  const updateItem = useCallback((updatedItem: T) => {
    setData(prevData => 
      prevData.map(item => 
        (item as any)[keyField] === (updatedItem as any)[keyField] 
          ? { ...item, ...updatedItem }
          : item
      )
    );
  }, [keyField]);

  const addItem = useCallback((newItem: T) => {
    setData(prevData => [newItem, ...prevData]);
  }, []);

  const removeItem = useCallback((itemId: string | number) => {
    setData(prevData => 
      prevData.filter(item => (item as any)[keyField] !== itemId)
    );
  }, [keyField]);

  const replaceData = useCallback((newData: T[]) => {
    setData(newData);
  }, []);

  const reset = useCallback(() => {
    setData(initialData);
  }, [initialData]);

  return {
    data,
    updateItem,
    addItem,
    removeItem,
    replaceData,
    reset,
  };
};

export default useApi;
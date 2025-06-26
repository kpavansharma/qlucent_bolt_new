import { useState, useEffect } from 'react';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    const callId = Math.random().toString(36).substr(2, 9);
    console.log(`🎯 [${callId}] useApi fetchData started`);
    console.log(`🔗 [${callId}] Dependencies:`, dependencies);
    
    try {
      setLoading(true);
      setError(null);
      console.log(`⏳ [${callId}] Loading state set to true, making API call...`);
      
      const result = await apiCall();
      
      console.log(`✨ [${callId}] API call successful:`, {
        resultType: typeof result,
        resultKeys: result && typeof result === 'object' ? Object.keys(result) : 'N/A',
        isArray: Array.isArray(result),
        hasItems: result && typeof result === 'object' && 'items' in result,
        itemsLength: result && typeof result === 'object' && 'items' in result && Array.isArray((result as any).items) ? (result as any).items.length : 'N/A',
        sampleResult: result && typeof result === 'object' ? 
                     (Array.isArray(result) ? result.slice(0, 2) : 
                      'items' in result && Array.isArray((result as any).items) ? (result as any).items.slice(0, 2) : result) : result
      });
      
      setData(result);
      console.log(`💾 [${callId}] Data state updated successfully`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error(`❌ [${callId}] API call failed:`, {
        error: errorMessage,
        errorObject: err,
        stack: err instanceof Error ? err.stack : undefined
      });
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
      console.log(`🏁 [${callId}] Loading state set to false, fetch complete`);
    }
  };

  useEffect(() => {
    const effectId = Math.random().toString(36).substr(2, 9);
    console.log(`🔄 [${effectId}] useApi useEffect triggered`);
    console.log(`📊 [${effectId}] Current state:`, { 
      hasData: !!data, 
      loading, 
      hasError: !!error,
      dependencies 
    });
    
    fetchData();
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

export function useAsyncData<T>(
  apiCall: () => Promise<T>,
  initialData: T | null = null
): UseApiState<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    const callId = Math.random().toString(36).substr(2, 9);
    console.log(`🎯 [${callId}] useAsyncData fetchData started`);
    
    try {
      setLoading(true);
      setError(null);
      console.log(`⏳ [${callId}] useAsyncData loading state set to true`);
      
      const result = await apiCall();
      
      console.log(`✨ [${callId}] useAsyncData API call successful:`, {
        resultType: typeof result,
        resultKeys: result && typeof result === 'object' ? Object.keys(result) : 'N/A'
      });
      
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error(`❌ [${callId}] useAsyncData API call failed:`, {
        error: errorMessage,
        errorObject: err
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.log(`🏁 [${callId}] useAsyncData loading complete`);
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}
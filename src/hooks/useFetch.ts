import { useEffect, useState } from 'react';

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetcher()
      .then((data) => {
        if (isMounted) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (isMounted) setState({ data: null, loading: false, error: err.message || 'Fetch failed' });
      });

    return () => {
      isMounted = false;
    };
  }, deps);

  return state;
}

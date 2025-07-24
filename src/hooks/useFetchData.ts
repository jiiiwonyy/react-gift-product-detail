import { useState, useEffect, useCallback } from "react";
import axios, { type AxiosResponse } from "axios";

type UseFetchDataParams<T, P> = {
  fetchFn: (params: P) => Promise<AxiosResponse<T>>;
  initFetchParams: P;
};

type UseFetchReturn<T, P> = {
  loading: boolean;
  error: boolean;
  data: T | undefined;
  errorStatus: number | null;
  refetch: (params: P) => Promise<void>;
};

export const useFetchData = <T, P>({
  fetchFn,
  initFetchParams,
}: UseFetchDataParams<T, P>): UseFetchReturn<T, P> => {
  const [data, setData] = useState<UseFetchReturn<T, P>["data"]>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  const fetchData = useCallback(
    async (params: P) => {
      try {
        setLoading(true);
        setError(false);
        setErrorStatus(null);

        const { data } = await fetchFn(params);
        setData(data);
      } catch (err) {
        setError(true);
        if (axios.isAxiosError(err) && err.response) {
          return setErrorStatus(err.response.status);
        }

        setErrorStatus(null);
      } finally {
        setLoading(false);
      }
    },
    [fetchFn]
  );

  const refetch = async (params: P) => {
    await fetchData(params);
  };

  useEffect(() => {
    fetchData(initFetchParams);
  }, [fetchData, initFetchParams]);

  return { data, loading, error, errorStatus, refetch };
};

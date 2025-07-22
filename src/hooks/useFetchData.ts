import { useState, useEffect } from "react";
import axios from "axios";

export function useFetchData<T>(fetchFn: () => Promise<{ data: { data: T } }>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchFn();
        setData(response.data.data);
        setError(null);
        setErrorStatus(null);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(
            err.response.data?.data?.message ?? "데이터를 가져오지 못했습니다."
          );
          setErrorStatus(err.response.status);
        } else {
          setError("에러가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchFn]);

  return { data, loading, error, errorStatus };
}

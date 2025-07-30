import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ErrorFallback = ({ error }: { error: unknown }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (!status || status === 404) {
        navigate("/", { replace: true });
        return;
      }

      if (status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      console.error("Unhandled Axios error:", error);
    } else {
      console.error("Non-Axios error:", error);
    }
  }, [error, navigate]);

  return null;
};

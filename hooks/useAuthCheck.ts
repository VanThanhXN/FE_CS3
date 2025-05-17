import { useEffect, useState } from "react";
import { getToken } from "../storage/storage";

export const useAuthCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      setIsAuthenticated(!!token);
    };

    checkAuth();
  }, []);

  return isAuthenticated;
};

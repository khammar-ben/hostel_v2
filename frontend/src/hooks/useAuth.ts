import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axios';

export const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  const logout = async () => {
    try {
      // Call logout API to invalidate token on server
      await axiosClient.post("/api/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local storage and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return {
    isAuthenticated: !!localStorage.getItem("token"),
    logout
  };
};

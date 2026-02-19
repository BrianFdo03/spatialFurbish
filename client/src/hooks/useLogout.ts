import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { logout } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";

export const useLogout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const response = await logout();

      toast.success(response.data.message || "Logout successful!", {
        duration: 3000,
      });

      localStorage.removeItem("user");
      localStorage.removeItem("cart");

      setUser(null);

      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Logout failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogout, isLoading };
};

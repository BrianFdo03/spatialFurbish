import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { logout } from "@/services/auth.service";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const Logout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const response = await logout();

      // ✅ Success toast (same style as login)
      toast.success(response.data.message || "Logout successful!", {
        duration: 3000,
      });

      // Clear user data from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("cart");

      setUser(null);

      // Optional delay like login page
      // setTimeout(() => {
      navigate("/login");
      // }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Logout failed", {
          duration: 3000,
        });
      } else {
        toast.error("An unexpected error occurred", {
          duration: 3000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="bg-transparent hover:bg-stone-900 text-stone-900 font-semibold hover:text-white py-2 px-4 border border-stone-900 hover:border-transparent rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Logging out..." : "Logout"}
      </button>
    </>
  );
};

export default Logout;

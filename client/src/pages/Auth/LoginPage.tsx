import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login(formData);

      toast.success(response.data.message || "Login successful!", {
        duration: 3000,
      });

      // Save user to localStorage for persistence
      localStorage.setItem("user", JSON.stringify(response.data));

      const user = {
        id: response.data._id,
        email: response.data.email,
        role: response.data.role,
        verified: response.data.verified,
      };

      setUser(user);

      setFormData({
        email: "",
        password: "",
      });

      if (user.role === "admin" && user.verified === true) {
        navigate("/dashboard");
      } else if (user.role === "staff" && user.verified === true) {
        navigate("/products");
      } else {
        navigate("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Login failed", {
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
    <div className="min-h-screen flex items-center justify-center bg-[#F3EFE0] px-4 font-sans text-stone-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-stone-800 mb-2">Login</h1>
          <p className="text-stone-600">Login to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-stone-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-800 focus:border-transparent outline-none transition bg-white"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-stone-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-800 focus:border-transparent outline-none transition bg-white"
              placeholder="6-20 characters"
            />
            <p className="text-xs text-stone-500 mt-1">
              Must be between 6 and 20 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-stone-900 text-white py-3 rounded-lg font-semibold hover:bg-stone-800 focus:ring-4 focus:ring-stone-900/20 transition disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-sm"
          >
            {isLoading ? "Logging In..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-stone-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-stone-900 font-bold hover:underline"
          >
            SignUp
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

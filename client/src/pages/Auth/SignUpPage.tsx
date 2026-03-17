import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { signup, checkEmail } from "@/services/auth.service";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";

interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
}

const SignupPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState<SignupFormData>({
    fullName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");

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
      // First, check if email exists and if it's a guest account
      const emailCheckResponse = await checkEmail(formData.email);

      if (emailCheckResponse.data.exists && emailCheckResponse.data.isGuest) {
        // Show dialog to user
        setGuestEmail(formData.email);
        setShowGuestDialog(true);
        setIsLoading(false);
        return;
      }

      // If not a guest account, proceed with normal signup
      const response = await signup(formData);

      toast.success(response.data.message || "Signup successful!", {
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
        fullName: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Signup failed", {
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

  const handleContinueWithSameEmail = async () => {
    setIsLoading(true);
    setShowGuestDialog(false);

    try {
      const response = await signup({
        ...formData,
        convertGuestAccount: true,
      });

      toast.success(
        response.data.message ||
          "Account updated successfully! You can now see your previous orders.",
        {
          duration: 3000,
        },
      );

      setFormData({
        fullName: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Signup failed", {
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

  const handleUseDifferentEmail = () => {
    setShowGuestDialog(false);
    setFormData({
      ...formData,
      email: "",
    });
    toast("Please enter a different email address", {
      icon: "📧",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3EFE0] px-4 font-sans text-stone-900">
      {/* Guest Account Dialog */}
      <Dialog open={showGuestDialog} onOpenChange={setShowGuestDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Previous Orders Found</DialogTitle>
            <DialogDescription className="pt-4 space-y-3">
              <p>
                We found previous orders linked to the email address{" "}
                <strong>{guestEmail}</strong>.
              </p>
              <p>You have two options:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>
                  <strong>Continue with this email:</strong> Your account will
                  be updated with the password you provided, and you'll be able
                  to see your previous order history.
                </li>
                <li>
                  <strong>Use a different email:</strong> Sign up with a new
                  email address (your previous orders will remain accessible if
                  you use the original email later).
                </li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <button
              onClick={handleUseDifferentEmail}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Use Different Email
            </button>
            <button
              onClick={handleContinueWithSameEmail}
              disabled={isLoading}
              className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Continue with Same Email"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-stone-800 mb-2">
            Create Account
          </h1>
          <p className="text-stone-600">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-stone-700 mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-800 focus:border-transparent outline-none transition bg-white"
              placeholder="John Doe"
            />
          </div>

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
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-stone-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-stone-900 font-bold hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

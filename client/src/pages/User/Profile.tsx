import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Eye, EyeOff } from "lucide-react"; // ✅ Imported Eye Icons

// ✅ Correct Import based on your Login/Signup pages
import { updateProfile } from "@/services/auth.service"; 

const Profile = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
  });

  const [loading, setLoading] = useState(false);

  // ✅ States to handle Password Visibility on Hover
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        
        if (storedUser) {
           const userObj = JSON.parse(storedUser);
           setFormData((prev) => ({
             ...prev,
             username: userObj.username || userObj.fullName || userObj.name || "",
             email: userObj.email || "",
             role: (userObj.role || "USER").toUpperCase(), 
           }));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Could not load user data");
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const response = await updateProfile({
        username: formData.username,
        password: formData.password
      });

      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...currentUser, fullName: response.data.username };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully!");
      
      setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));

    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || "Failed to update profile";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      
      {/* FULL WIDTH CONTAINER */}
      <div className="w-full px-6 py-8">
        
        {/* BACK TO STORE BUTTON */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium text-sm group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Store
          </Link>
        </div>

        {/* Page Title */}
        <div className="w-full mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
            <p className="text-gray-500 mt-1">Manage your profile information and security.</p>
          </div>
          <span 
            style={{ 
              color: "rgb(138, 155, 130)", 
              backgroundColor: "rgba(138, 155, 130, 0.1)" 
            }}
            className="text-sm font-medium uppercase tracking-wide px-3 py-1 rounded-full h-fit"
          >
            {formData.role}
          </span>
        </div>

        {/* FORM CARD */}
        <div className="w-full">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Edit Profile</h3>
              
              <Link 
                to="/user-order" 
                style={{ color: "rgb(0, 0, 0)" }} 
                className="text-sm font-medium hover:opacity-80 transition-opacity"
              >
                My Orders &rarr;
              </Link>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Personal Information */}
                <div>
                  <h4 className="text-sm uppercase tracking-wide text-gray-500 font-bold mb-4">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white text-gray-900"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Security */}
                <div>
                  <h4 className="text-sm uppercase tracking-wide text-gray-500 font-bold mb-4">Security</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* NEW PASSWORD FIELD WITH EYE ICON */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"} // Toggles based on hover
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        />
                        <div 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                          onMouseEnter={() => setShowPassword(true)} // Show on hover
                          onMouseLeave={() => setShowPassword(false)} // Hide on leave
                        >
                          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </div>
                      </div>
                    </div>
                    
                    {/* CONFIRM PASSWORD FIELD WITH EYE ICON */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"} // Toggles based on hover
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        />
                         <div 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                          onMouseEnter={() => setShowConfirmPassword(true)} // Show on hover
                          onMouseLeave={() => setShowConfirmPassword(false)} // Hide on leave
                        >
                          {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </div>
                      </div>
                    </div>
                  
                  </div>
                </div>

                {/* Submit Button Area */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    // Custom Sage Green Styles
                    style={{ 
                      backgroundColor: "rgb(138, 155, 130)",
                      borderBottomWidth: "0px",
                      borderStyle: "solid"
                    }}
                    className={`
                      flex items-center px-6 py-2.5 rounded-lg text-white font-medium shadow-sm transition-all hover:opacity-90 active:scale-95
                      ${loading ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : "Save Changes"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
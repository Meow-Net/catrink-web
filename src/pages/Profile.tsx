import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Save,
  Edit3,
  Camera,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import Layout from "@/components/Layout";
import MeowChatbot from "@/components/MeowChatbot";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    newsletter: boolean;
    promotions: boolean;
    orderUpdates: boolean;
  };
  bio: string;
}

const Profile = () => {
  // Add error handling for auth context
  let currentUser: any = null;
  let isAdmin = false;

  try {
    const authContext = useAuth();
    currentUser = authContext.currentUser;
    isAdmin = authContext.isAdmin;
  } catch (error) {
    console.error("Auth context error:", error);
  }
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: isAdmin ? "Admin User" : currentUser?.displayName || "",
    email: currentUser?.email || "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    preferences: {
      newsletter: true,
      promotions: true,
      orderUpdates: true,
    },
    bio: "",
  });

  // Load profile data from localStorage on component mount
  useEffect(() => {
    const userEmail = currentUser?.email || (isAdmin ? "admin@catrink.in" : "");
    if (userEmail) {
      const savedProfile = localStorage.getItem(`catrink_profile_${userEmail}`);
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          setProfileData((prev) => ({ ...prev, ...parsed }));
        } catch (error) {
          console.error("Error loading profile:", error);
        }
      }
    }
  }, [currentUser, isAdmin]);

  const handleInputChange = (
    field: string,
    value: string | boolean,
    nested?: string,
  ) => {
    setProfileData((prev) => {
      if (nested) {
        return {
          ...prev,
          [nested]: {
            ...(prev as any)[nested],
            [field]: value,
          },
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleSave = async () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Save to localStorage
      const userEmail =
        currentUser?.email || (isAdmin ? "admin@catrink.in" : "");
      if (userEmail) {
        localStorage.setItem(
          `catrink_profile_${userEmail}`,
          JSON.stringify(profileData),
        );
      }

      setLoading(false);
      setIsEditing(false);
      alert("Profile updated successfully! Meow! 🐱");
    }, 1500);
  };

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      alert("New passwords don't match!");
      return;
    }

    if (passwords.new.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);

    // Simulate password change
    setTimeout(() => {
      setLoading(false);
      setShowPasswordFields(false);
      setPasswords({ current: "", new: "", confirm: "" });
      alert("Password changed successfully!");
    }, 1500);
  };

  if (!currentUser && !isAdmin) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <User className="w-16 h-16 text-neon-blue mx-auto mb-4" />
            <h1 className="font-orbitron font-bold text-2xl text-white mb-4">
              Login Required
            </h1>
            <p className="text-white/60 mb-8">
              Please login to view your profile
            </p>
            <Link to="/login" className="catrink-button">
              Login
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="relative py-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-orbitron font-black text-5xl text-white mb-4">
                  <span className="text-glow-blue">My</span>{" "}
                  <span className="text-glow-purple">Profile</span>
                </h1>
                <p className="text-xl text-white/70">
                  Manage your personal information and preferences
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-6 py-3 rounded-lg glass-card hover:bg-white/10 transition-colors text-white"
                  >
                    <Edit3 className="w-5 h-5" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 rounded-lg font-orbitron font-semibold text-white border-2 border-white/20 hover:bg-white/10 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className={cn(
                        "catrink-button flex items-center space-x-2",
                        loading && "opacity-50 cursor-not-allowed",
                      )}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture & Basic Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Profile Picture */}
              <div className="glass-card p-8 text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-red flex items-center justify-center text-4xl text-white font-orbitron font-bold">
                    {isAdmin ? "A" : profileData.fullName?.[0] || "U"}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-10 h-10 bg-neon-blue rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
                      <Camera className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <h3 className="font-orbitron font-bold text-xl text-white mb-2">
                  {profileData.fullName || "User"}
                </h3>
                <p className="text-neon-cyan mb-4">{profileData.email}</p>
                {isAdmin && (
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neon-cyan/20 border border-neon-cyan/30 text-neon-cyan text-sm">
                    <Shield className="w-4 h-4" />
                    <span>Administrator</span>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="glass-card p-6">
                <h4 className="font-orbitron font-bold text-white mb-4">
                  Account Stats
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Member Since:</span>
                    <span className="text-white">Dec 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Total Orders:</span>
                    <span className="text-neon-green">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Favorite Flavor:</span>
                    <span className="text-neon-purple">Mango Bluster</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Profile Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Personal Information */}
              <div className="glass-card p-8">
                <h3 className="font-orbitron font-bold text-2xl text-white mb-6">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors disabled:opacity-50"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled={true}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white/50 placeholder-white/40 opacity-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-white/50 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-colors disabled:opacity-50"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange("dateOfBirth", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-red focus:ring-1 focus:ring-neon-red transition-colors disabled:opacity-50"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      Gender
                    </label>
                    <select
                      value={profileData.gender}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors disabled:opacity-50"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-pink focus:ring-1 focus:ring-neon-pink transition-colors disabled:opacity-50 resize-none"
                      placeholder="Tell us about yourself and your energy drink preferences..."
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="glass-card p-8">
                <h3 className="font-orbitron font-bold text-2xl text-white mb-6">
                  Address Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={profileData.address.street}
                      onChange={(e) =>
                        handleInputChange("street", e.target.value, "address")
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors disabled:opacity-50"
                      placeholder="Enter your street address"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={profileData.address.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value, "address")
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-colors disabled:opacity-50"
                      placeholder="Enter your city"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={profileData.address.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value, "address")
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-red focus:ring-1 focus:ring-neon-red transition-colors disabled:opacity-50"
                      placeholder="Enter your state"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={profileData.address.zipCode}
                      onChange={(e) =>
                        handleInputChange("zipCode", e.target.value, "address")
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors disabled:opacity-50"
                      placeholder="Enter your ZIP code"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      Country
                    </label>
                    <select
                      value={profileData.address.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value, "address")
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-pink focus:ring-1 focus:ring-neon-pink transition-colors disabled:opacity-50"
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="IN">India</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="glass-card p-8">
                <h3 className="font-orbitron font-bold text-2xl text-white mb-6">
                  Preferences
                </h3>

                <div className="space-y-4">
                  {[
                    {
                      key: "newsletter",
                      label: "Newsletter Subscription",
                      desc: "Receive monthly updates about new flavors and promotions",
                    },
                    {
                      key: "promotions",
                      label: "Promotional Offers",
                      desc: "Get notified about special discounts and deals",
                    },
                    {
                      key: "orderUpdates",
                      label: "Order Updates",
                      desc: "Receive real-time updates about your orders via email",
                    },
                  ].map((pref) => (
                    <div key={pref.key} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={(profileData.preferences as any)[pref.key]}
                        onChange={(e) =>
                          handleInputChange(
                            pref.key,
                            e.target.checked,
                            "preferences",
                          )
                        }
                        disabled={!isEditing}
                        className="w-5 h-5 mt-0.5 rounded border-2 border-white/20 bg-white/5 text-neon-blue focus:ring-neon-blue disabled:opacity-50"
                      />
                      <div>
                        <label className="text-white font-orbitron font-medium">
                          {pref.label}
                        </label>
                        <p className="text-white/60 text-sm">{pref.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Password Change */}
              <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-orbitron font-bold text-2xl text-white">
                    Security
                  </h3>
                  <button
                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                    className="px-4 py-2 rounded-lg glass-card hover:bg-white/10 transition-colors text-white font-orbitron text-sm"
                  >
                    {showPasswordFields ? "Cancel" : "Change Password"}
                  </button>
                </div>

                {showPasswordFields && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwords.current}
                        onChange={(e) =>
                          setPasswords((prev) => ({
                            ...prev,
                            current: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors"
                        placeholder="Enter current password"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwords.new}
                        onChange={(e) =>
                          setPasswords((prev) => ({
                            ...prev,
                            new: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-colors"
                        placeholder="Enter new password"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) =>
                          setPasswords((prev) => ({
                            ...prev,
                            confirm: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-red focus:ring-1 focus:ring-neon-red transition-colors"
                        placeholder="Confirm new password"
                      />
                    </div>

                    <button
                      onClick={handlePasswordChange}
                      disabled={
                        loading ||
                        !passwords.current ||
                        !passwords.new ||
                        !passwords.confirm
                      }
                      className={cn(
                        "w-full catrink-button",
                        (loading ||
                          !passwords.current ||
                          !passwords.new ||
                          !passwords.confirm) &&
                          "opacity-50 cursor-not-allowed",
                      )}
                    >
                      {loading ? "Updating Password..." : "Update Password"}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <MeowChatbot />
    </Layout>
  );
};

export default Profile;

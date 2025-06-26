import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Zap,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import MeowChatbot from "@/components/MeowChatbot";
import { cn } from "@/lib/utils";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    return requirements;
  };

  const passwordRequirements = validatePassword(formData.password);
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!isPasswordValid) {
      setError("Password does not meet requirements");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await signup(formData.email, formData.password);
      navigate("/shop");
    } catch (error: any) {
      console.error("Signup error:", error);
      if (error.code === "auth/email-already-in-use") {
        setError("An account with this email already exists");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="relative py-20 lg:py-32 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-neon-purple via-neon-red to-neon-cyan flex items-center justify-center animate-float">
                <User className="w-10 h-10 text-white" />
              </div>
              <h1 className="font-orbitron font-bold text-4xl text-white mb-4">
                <span className="text-glow-purple">Join the</span>{" "}
                <span className="text-glow-red">Pack</span>
              </h1>
              <p className="text-white/70 text-lg">
                Create your account to unleash your potential
              </p>
            </div>

            {/* Signup Form */}
            <div className="glass-card p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-colors"
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                {formData.password && (
                  <div className="glass-card p-4 space-y-2">
                    <h4 className="text-white/80 text-sm font-orbitron font-medium">
                      Password Requirements:
                    </h4>
                    <div className="space-y-1 text-xs">
                      {[
                        { key: "length", text: "At least 8 characters" },
                        { key: "uppercase", text: "One uppercase letter" },
                        { key: "lowercase", text: "One lowercase letter" },
                        { key: "number", text: "One number" },
                        { key: "special", text: "One special character" },
                      ].map(({ key, text }) => (
                        <div
                          key={key}
                          className={cn(
                            "flex items-center space-x-2",
                            passwordRequirements[
                              key as keyof typeof passwordRequirements
                            ]
                              ? "text-green-400"
                              : "text-white/50",
                          )}
                        >
                          <CheckCircle
                            className={cn(
                              "w-3 h-3",
                              passwordRequirements[
                                key as keyof typeof passwordRequirements
                              ]
                                ? "text-green-400"
                                : "text-white/30",
                            )}
                          />
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={cn(
                        "w-full pl-10 pr-12 py-3 bg-white/5 border rounded-lg text-white placeholder-white/40 focus:outline-none transition-colors",
                        formData.confirmPassword &&
                          formData.password === formData.confirmPassword
                          ? "border-green-500/50 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                          : formData.confirmPassword &&
                              formData.password !== formData.confirmPassword
                            ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            : "border-white/10 focus:border-neon-red focus:ring-1 focus:ring-neon-red",
                      )}
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {formData.confirmPassword &&
                    formData.password !== formData.confirmPassword && (
                      <p className="text-red-400 text-xs mt-1">
                        Passwords do not match
                      </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={
                    loading ||
                    !isPasswordValid ||
                    formData.password !== formData.confirmPassword
                  }
                  className={cn(
                    "w-full catrink-button text-lg py-3",
                    (loading ||
                      !isPasswordValid ||
                      formData.password !== formData.confirmPassword) &&
                      "opacity-50 cursor-not-allowed",
                  )}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-background text-white/60">
                      Already have an account?
                    </span>
                  </div>
                </div>

                {/* Sign In Link */}
                <Link
                  to="/login"
                  className="w-full block text-center px-6 py-3 rounded-lg font-orbitron font-semibold text-white border-2 border-neon-blue hover:bg-neon-blue/10 transition-all duration-300"
                >
                  Sign In
                </Link>
              </form>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <p className="text-white/50 text-sm">
                Join thousands of energy seekers who have awakened their inner
                cat. Meow! 🐱
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <MeowChatbot />
    </Layout>
  );
};

export default Signup;

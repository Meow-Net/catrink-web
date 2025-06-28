import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import MeowChatbot from "@/components/MeowChatbot";
import { cn } from "@/lib/utils";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setError("");
      setMessage("");
      setLoading(true);

      await resetPassword(email);

      setSuccess(true);
      setMessage(
        "Password reset link sent! Check your email inbox for instructions to reset your password. Meow! 🐱",
      );
    } catch (error: any) {
      console.error("Password reset error:", error);

      // Handle specific Firebase error codes
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address format.");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many requests. Please try again later.");
      } else {
        setError("Failed to send password reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="relative py-20 lg:py-32 min-h-screen flex items-center justify-center">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-neon-blue/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-40 right-20 w-40 h-40 bg-neon-purple/20 rounded-full blur-3xl animate-pulse delay-300" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-neon-red/10 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="max-w-md w-full mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-card p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center"
              >
                <Mail className="w-8 h-8 text-white" />
              </motion.div>

              <h1 className="font-orbitron font-black text-3xl text-white mb-2">
                Reset Password
              </h1>
              <p className="text-white/70 text-sm">
                Enter your email to receive a password reset link
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start space-x-3"
              >
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-400 text-sm font-semibold mb-1">
                    Email Sent Successfully!
                  </p>
                  <p className="text-green-300 text-xs">{message}</p>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-white/80 text-sm font-semibold mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors"
                    placeholder="Enter your email address"
                    disabled={loading || success}
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className={cn(
                  "w-full catrink-button flex items-center justify-center space-x-2 py-3",
                  (loading || success) && "opacity-50 cursor-not-allowed",
                )}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Email Sent!</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>
            </form>

            {/* Additional Instructions */}
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg"
              >
                <h3 className="text-blue-400 font-semibold text-sm mb-2">
                  What's Next?
                </h3>
                <ul className="text-blue-300 text-xs space-y-1">
                  <li>• Check your email inbox for the reset link</li>
                  <li>• Don't forget to check your spam folder</li>
                  <li>• Click the link to create a new password</li>
                  <li>• Return to login with your new password</li>
                </ul>
              </motion.div>
            )}

            {/* Back to Login */}
            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 text-neon-cyan hover:text-neon-blue transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </Link>
            </div>

            {/* Help Section */}
            <div className="mt-6 text-center">
              <p className="text-white/50 text-xs mb-2">
                Still having trouble?
              </p>
              <Link
                to="/contact"
                className="text-neon-purple hover:text-neon-pink transition-colors text-xs underline"
              >
                Contact Support
              </Link>
            </div>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-white/40 text-xs leading-relaxed">
              🔒 Your account security is important to us. The reset link will
              expire in 1 hour for your protection.
            </p>
          </motion.div>
        </div>
      </section>

      <MeowChatbot />
    </Layout>
  );
};

export default PasswordReset;

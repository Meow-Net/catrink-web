import { motion } from "framer-motion";
import { Shield, Settings, Database } from "lucide-react";
import Layout from "@/components/Layout";
import MeowChatbot from "@/components/MeowChatbot";

const Admin = () => {
  return (
    <Layout>
      <section className="relative py-20 lg:py-32 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple flex items-center justify-center animate-float">
              <Shield className="w-12 h-12 text-white" />
            </div>

            <h1 className="font-orbitron font-black text-5xl md:text-7xl text-white mb-8">
              <span className="text-glow-cyan">Admin</span>
            </h1>

            <div className="glass-card p-12 mb-8">
              <h2 className="font-orbitron font-bold text-3xl text-neon-blue mb-6">
                Secure Admin Panel Coming Soon
              </h2>
              <p className="text-xl text-white/70 leading-relaxed mb-8">
                A comprehensive admin dashboard is being developed with Firebase
                Auth integration for secure access. Features will include:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6">
                  <Database className="w-12 h-12 text-neon-purple mx-auto mb-4" />
                  <h3 className="font-orbitron font-semibold text-lg text-white mb-3">
                    Product Management
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Add, edit, and manage energy drink products, flavours, and
                    inventory with real-time updates.
                  </p>
                </div>

                <div className="glass-card p-6">
                  <Settings className="w-12 h-12 text-neon-red mx-auto mb-4" />
                  <h3 className="font-orbitron font-semibold text-lg text-white mb-3">
                    Coupon System
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Create and manage discount codes, promotional offers, and
                    special cat-themed campaigns.
                  </p>
                </div>

                <div className="glass-card p-6">
                  <Shield className="w-12 h-12 text-neon-cyan mx-auto mb-4" />
                  <h3 className="font-orbitron font-semibold text-lg text-white mb-3">
                    Secure Access
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Role-based authentication with Firebase to ensure only
                    authorized personnel can access admin features.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 bg-gradient-to-r from-neon-red/10 to-neon-purple/10 border border-neon-red/30">
              <h3 className="font-orbitron font-semibold text-xl text-neon-red mb-4">
                🔒 Access Restricted
              </h3>
              <p className="text-white/70">
                This area requires administrative privileges. Please contact
                your system administrator for access credentials.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <MeowChatbot />
    </Layout>
  );
};

export default Admin;

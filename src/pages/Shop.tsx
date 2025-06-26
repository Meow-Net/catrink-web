import { motion } from "framer-motion";
import { ShoppingCart, Zap } from "lucide-react";
import Layout from "@/components/Layout";
import MeowChatbot from "@/components/MeowChatbot";

const Shop = () => {
  return (
    <Layout>
      <section className="relative py-20 lg:py-32 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-neon-purple via-neon-red to-neon-cyan flex items-center justify-center animate-float">
              <ShoppingCart className="w-12 h-12 text-white" />
            </div>

            <h1 className="font-orbitron font-black text-5xl md:text-7xl text-white mb-8">
              <span className="text-glow-purple">Shop</span>
            </h1>

            <div className="glass-card p-12 mb-8">
              <h2 className="font-orbitron font-bold text-3xl text-neon-red mb-6">
                E-Commerce Coming Soon
              </h2>
              <p className="text-xl text-white/70 leading-relaxed mb-6">
                Our full e-commerce experience with Firebase Auth, Firestore,
                and Stripe payments is being developed. Soon you'll be able to:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="glass-card p-6">
                  <Zap className="w-8 h-8 text-neon-blue mb-4" />
                  <h3 className="font-orbitron font-semibold text-white mb-2">
                    Secure Shopping
                  </h3>
                  <p className="text-white/60 text-sm">
                    Browse products, add to cart, and checkout with Stripe
                    integration.
                  </p>
                </div>
                <div className="glass-card p-6">
                  <Zap className="w-8 h-8 text-neon-purple mb-4" />
                  <h3 className="font-orbitron font-semibold text-white mb-2">
                    User Accounts
                  </h3>
                  <p className="text-white/60 text-sm">
                    Firebase Auth for secure login and order history.
                  </p>
                </div>
                <div className="glass-card p-6">
                  <Zap className="w-8 h-8 text-neon-red mb-4" />
                  <h3 className="font-orbitron font-semibold text-white mb-2">
                    Real-time Updates
                  </h3>
                  <p className="text-white/60 text-sm">
                    Firestore for live inventory and order tracking.
                  </p>
                </div>
                <div className="glass-card p-6">
                  <Zap className="w-8 h-8 text-neon-cyan mb-4" />
                  <h3 className="font-orbitron font-semibold text-white mb-2">
                    Mobile Optimized
                  </h3>
                  <p className="text-white/60 text-sm">
                    Smooth shopping experience on all devices.
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <button className="catrink-button text-lg">Join Waitlist</button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <MeowChatbot />
    </Layout>
  );
};

export default Shop;

import { motion } from "framer-motion";
import { Zap, ComingSoon } from "lucide-react";
import Layout from "@/components/Layout";
import MeowChatbot from "@/components/MeowChatbot";

const Flavours = () => {
  return (
    <Layout>
      <section className="relative py-20 lg:py-32 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-red flex items-center justify-center animate-float">
              <Zap className="w-12 h-12 text-white" />
            </div>

            <h1 className="font-orbitron font-black text-5xl md:text-7xl text-white mb-8">
              <span className="text-glow-blue">Flavours</span>
            </h1>

            <div className="glass-card p-12 mb-8">
              <h2 className="font-orbitron font-bold text-3xl text-neon-purple mb-6">
                Coming Soon
              </h2>
              <p className="text-xl text-white/70 leading-relaxed mb-8">
                Our neon product showcase carousel is being crafted with the
                same precision and attention to detail as our energy drinks. Get
                ready to explore our electrifying flavours that will awaken your
                inner cat.
              </p>
              <p className="text-lg text-white/60">
                Stay tuned for an immersive experience featuring our signature
                blends. Meow! 🐱
              </p>
            </div>

            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <button className="catrink-button text-lg">
                Notify Me When Ready
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <MeowChatbot />
    </Layout>
  );
};

export default Flavours;

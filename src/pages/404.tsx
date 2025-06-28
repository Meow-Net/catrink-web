import { motion } from "framer-motion";
import { Home, Search, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import MeowChatbot from "@/components/MeowChatbot";

const NotFound = () => {
  return (
    <Layout>
      <section className="relative py-20 lg:py-32 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* 404 Cat Eyes */}
            <div className="flex justify-center items-center space-x-8 mb-8">
              <div className="cat-eye w-16 h-16"></div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="font-orbitron font-black text-8xl md:text-9xl text-neon-red"
              >
                4
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center"
              >
                <Zap className="w-8 h-8 text-white" />
              </motion.div>
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="font-orbitron font-black text-8xl md:text-9xl text-neon-purple"
              >
                4
              </motion.div>
              <div className="cat-eye w-16 h-16"></div>
            </div>

            <h1 className="font-orbitron font-bold text-4xl md:text-6xl text-white mb-6">
              <span className="text-glow-blue">Page</span>{" "}
              <span className="text-glow-red">Not Found</span>
            </h1>

            <div className="glass-card p-12 mb-8">
              <h2 className="font-orbitron font-bold text-2xl text-neon-cyan mb-6">
                Oops! This page went hunting 🐱
              </h2>
              <p className="text-xl text-white/70 leading-relaxed mb-8">
                It seems like this page has wandered off into the digital
                wilderness. Don't worry, even the most agile cats sometimes get
                lost. Let's get you back on track to awaken your inner energy!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <Search className="w-12 h-12 text-neon-purple mx-auto mb-4" />
                  <h3 className="font-orbitron font-semibold text-lg text-white mb-3">
                    Lost Your Way?
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Try checking the URL or use our navigation to explore our
                    amazing energy drinks and brand story.
                  </p>
                </div>

                <div className="glass-card p-6">
                  <Zap className="w-12 h-12 text-neon-blue mx-auto mb-4" />
                  <h3 className="font-orbitron font-semibold text-lg text-white mb-3">
                    Need Help?
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Chat with MeowCat, our playful assistant, for instant help
                    finding what you're looking for. Meow!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/"
                className="catrink-button flex items-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>

              <Link
                to="/about"
                className="px-8 py-3 rounded-lg font-orbitron font-semibold text-white border-2 border-neon-purple hover:bg-neon-purple/10 transition-all duration-300"
              >
                Learn About Catrink
              </Link>
            </div>

            {/* Fun Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-12"
            >
              <p className="text-white/40 text-sm font-orbitron">
                Error 404: Cat reflexes couldn't catch this page in time 🐾
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <MeowChatbot />
    </Layout>
  );
};

export default NotFound;

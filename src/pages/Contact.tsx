import { motion } from "framer-motion";
import { Mail, MessageSquare } from "lucide-react";
import Layout from "@/components/Layout";
import MeowChatbot from "@/components/MeowChatbot";

const Contact = () => {
  return (
    <Layout>
      <section className="relative py-20 lg:py-32 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-neon-red via-neon-cyan to-neon-blue flex items-center justify-center animate-float">
              <Mail className="w-12 h-12 text-white" />
            </div>

            <h1 className="font-orbitron font-black text-5xl md:text-7xl text-white mb-8">
              <span className="text-glow-red">Contact</span>
            </h1>

            <div className="glass-card p-12 mb-8">
              <h2 className="font-orbitron font-bold text-3xl text-neon-cyan mb-6">
                Smooth Animated Form Coming Soon
              </h2>
              <p className="text-xl text-white/70 leading-relaxed mb-8">
                We're designing a beautiful, animated contact form with smooth
                transitions and real-time validation. In the meantime, our
                MeowCat chatbot is ready to assist you!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-6">
                  <MessageSquare className="w-12 h-12 text-neon-purple mx-auto mb-4" />
                  <h3 className="font-orbitron font-semibold text-xl text-white mb-3">
                    Chat with MeowCat
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    Get instant answers from our playful AI assistant. Click the
                    chat button to start a conversation. Meow!
                  </p>
                </div>

                <div className="glass-card p-6">
                  <Mail className="w-12 h-12 text-neon-blue mx-auto mb-4" />
                  <h3 className="font-orbitron font-semibold text-xl text-white mb-3">
                    Direct Contact
                  </h3>
                  <p className="text-white/60 leading-relaxed mb-4">
                    For business inquiries, partnerships, or general questions:
                  </p>
                  <a
                    href="mailto:hello@catrink.energy"
                    className="text-neon-cyan hover:text-neon-purple transition-colors"
                  >
                    hello@catrink.energy
                  </a>
                </div>
              </div>
            </div>

            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <button
                onClick={() =>
                  document.querySelector("[data-chatbot-toggle]")?.click?.()
                }
                className="catrink-button text-lg"
              >
                Chat with MeowCat Now
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <MeowChatbot />
    </Layout>
  );
};

export default Contact;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Star, ShoppingCart, Play } from "lucide-react";
import Layout from "@/components/Layout";
import Preloader from "@/components/Preloader";
import MeowChatbot from "@/components/MeowChatbot";
import { cn } from "@/lib/utils";

const Index = () => {
  const [showPreloader, setShowPreloader] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (showPreloader) {
    return <Preloader onComplete={() => setShowPreloader(false)} />;
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />

          {/* Floating Orbs */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                "absolute rounded-full opacity-20 blur-xl",
                i % 3 === 0 && "bg-neon-blue",
                i % 3 === 1 && "bg-neon-purple",
                i % 3 === 2 && "bg-neon-red",
              )}
              style={{
                width: `${100 + Math.random() * 200}px`,
                height: `${100 + Math.random() * 200}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Mouse Follower Effect */}
          <motion.div
            className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-neon-blue/10 via-neon-purple/10 to-neon-red/10 blur-3xl pointer-events-none"
            animate={{
              x: mousePosition.x - 192,
              y: mousePosition.y - 192,
            }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Main Logo */}
            <h1 className="catrink-logo animate-neon-pulse mb-6">CATRINK</h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-3xl lg:text-4xl font-orbitron font-medium text-white mb-8 leading-relaxed"
            >
              <span className="text-glow-blue">Awaken the Cat reflex</span>
              <br />
              <span className="text-glow-purple">Inside you</span>
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-lg md:text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Premium energy drinks crafted to unleash your inner predator.
              Experience electrifying taste and unstoppable energy with every
              sip.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Link
                to="/shop"
                className="catrink-button flex items-center space-x-2 text-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/about"
                className="px-8 py-3 rounded-lg font-orbitron font-semibold text-white border-2 border-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300 flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Watch Story</span>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              <div className="glass-card p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-orbitron font-bold text-2xl text-neon-blue mb-2">
                  1M+
                </h3>
                <p className="text-white/60">Energy Seekers</p>
              </div>

              <div className="glass-card p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-purple to-neon-red flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-orbitron font-bold text-2xl text-neon-purple mb-2">
                  4.9★
                </h3>
                <p className="text-white/60">Rating</p>
              </div>

              <div className="glass-card p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-red to-neon-cyan flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-orbitron font-bold text-2xl text-neon-red mb-2">
                  12h
                </h3>
                <p className="text-white/60">Energy Boost</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-neon-cyan rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1 h-3 bg-neon-cyan rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-orbitron font-bold text-4xl md:text-5xl text-white mb-6">
              <span className="text-glow-blue">Why Choose</span>{" "}
              <span className="text-glow-purple">Catrink?</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Discover what makes Catrink the ultimate energy drink for those
              who dare to be different.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Instant Energy Boost",
                description:
                  "Feel the surge of power within seconds. Our advanced formula delivers immediate and sustained energy.",
                color: "neon-blue",
              },
              {
                icon: Star,
                title: "Premium Ingredients",
                description:
                  "Only the finest natural ingredients sourced globally to create the perfect energy experience.",
                color: "neon-purple",
              },
              {
                icon: Zap,
                title: "Cat-like Reflexes",
                description:
                  "Enhance your reaction time and mental clarity. Unleash your inner predator instincts.",
                color: "neon-red",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300"
              >
                <div
                  className={cn(
                    "w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center",
                    feature.color === "neon-blue" &&
                      "bg-gradient-to-r from-neon-blue/20 to-neon-blue/40 border border-neon-blue/30",
                    feature.color === "neon-purple" &&
                      "bg-gradient-to-r from-neon-purple/20 to-neon-purple/40 border border-neon-purple/30",
                    feature.color === "neon-red" &&
                      "bg-gradient-to-r from-neon-red/20 to-neon-red/40 border border-neon-red/30",
                  )}
                >
                  <feature.icon
                    className={cn(
                      "w-8 h-8",
                      feature.color === "neon-blue" && "text-neon-blue",
                      feature.color === "neon-purple" && "text-neon-purple",
                      feature.color === "neon-red" && "text-neon-red",
                    )}
                  />
                </div>
                <h3 className="font-orbitron font-semibold text-xl text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <MeowChatbot />
    </Layout>
  );
};

export default Index;

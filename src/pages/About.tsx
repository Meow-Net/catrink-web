import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, Target, Award, Users, Heart, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import MeowChatbot from "@/components/MeowChatbot";
import { cn } from "@/lib/utils";

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
          {/* Animated background elements */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                "absolute rounded-full opacity-10 blur-2xl",
                i % 3 === 0 && "bg-neon-blue",
                i % 3 === 1 && "bg-neon-purple",
                i % 3 === 2 && "bg-neon-red",
              )}
              style={{
                width: `${150 + Math.random() * 100}px`,
                height: `${150 + Math.random() * 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 50 - 25],
                y: [0, Math.random() * 50 - 25],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="font-orbitron font-black text-5xl md:text-7xl lg:text-8xl mb-8">
              <span className="text-glow-blue">Our</span>{" "}
              <span className="text-glow-purple">Story</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Born from the wild spirit of nocturnal hunters, Catrink emerged to
              awaken the dormant predator instincts within every energy seeker.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="font-orbitron font-bold text-4xl md:text-5xl text-white mb-8">
                <span className="text-glow-red">The Beginning</span>
              </h2>
              <div className="space-y-6 text-lg text-white/70 leading-relaxed">
                <p>
                  In the neon-lit laboratories of Neo Tokyo, a team of
                  biochemists and feline behaviorists made a groundbreaking
                  discovery. They unlocked the secret behind cats' incredible
                  reflexes, agility, and unwavering focus.
                </p>
                <p>
                  What if humans could tap into this same energy? What if we
                  could awaken our dormant predator instincts and achieve
                  cat-like performance in everything we do?
                </p>
                <p>
                  Thus,{" "}
                  <span className="text-neon-purple font-semibold">
                    Catrink
                  </span>{" "}
                  was born - not just as an energy drink, but as a revolution in
                  human potential.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass-card p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 via-neon-purple/5 to-neon-red/5" />
                <div className="relative z-10">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-red flex items-center justify-center animate-float">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-orbitron font-bold text-2xl text-center text-white mb-4">
                    The Formula
                  </h3>
                  <p className="text-white/70 text-center leading-relaxed">
                    A perfect blend of natural caffeine, taurine, B-vitamins,
                    and our proprietary Feline Focus Complex™ - designed to
                    enhance reaction time, mental clarity, and sustained energy
                    without the crash.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
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
              <span className="text-glow-blue">Our</span>{" "}
              <span className="text-glow-purple">Mission</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-neon-blue/20 to-neon-purple/40 border border-neon-blue/30 flex items-center justify-center">
                <Target className="w-8 h-8 text-neon-blue" />
              </div>
              <h3 className="font-orbitron font-bold text-2xl text-white mb-4">
                Mission
              </h3>
              <p className="text-white/70 leading-relaxed">
                To awaken the dormant predator instincts within every
                individual, empowering them to achieve peak performance,
                lightning-fast reflexes, and unwavering focus in their daily
                pursuits.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-neon-purple/20 to-neon-red/40 border border-neon-purple/30 flex items-center justify-center">
                <Zap className="w-8 h-8 text-neon-purple" />
              </div>
              <h3 className="font-orbitron font-bold text-2xl text-white mb-4">
                Vision
              </h3>
              <p className="text-white/70 leading-relaxed">
                To create a world where every person can tap into their inner
                cat, achieving extraordinary levels of agility, awareness, and
                energy that transforms how they approach challenges and
                opportunities.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-orbitron font-bold text-4xl md:text-5xl text-white mb-6">
              <span className="text-glow-red">Core</span>{" "}
              <span className="text-glow-cyan">Values</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              The principles that guide everything we do at Catrink.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Excellence",
                description:
                  "We never compromise on quality. Every can of Catrink represents our commitment to delivering the finest energy experience.",
                color: "neon-blue",
              },
              {
                icon: Users,
                title: "Community",
                description:
                  "Building a pack of energy seekers who support each other in achieving their peak potential and unleashing their inner cat.",
                color: "neon-purple",
              },
              {
                icon: Heart,
                title: "Passion",
                description:
                  "Driven by our love for innovation and the relentless pursuit of creating products that truly make a difference.",
                color: "neon-red",
              },
              {
                icon: Sparkles,
                title: "Innovation",
                description:
                  "Constantly pushing boundaries in energy science to develop formulations that enhance human performance naturally.",
                color: "neon-cyan",
              },
              {
                icon: Target,
                title: "Focus",
                description:
                  "Like a cat stalking its prey, we maintain laser focus on our goal of helping people achieve their best selves.",
                color: "neon-pink",
              },
              {
                icon: Zap,
                title: "Energy",
                description:
                  "Not just what we create, but who we are. High-energy thinking leads to high-energy solutions and experiences.",
                color: "neon-blue",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300"
              >
                <div
                  className={cn(
                    "w-14 h-14 mx-auto mb-6 rounded-full flex items-center justify-center",
                    value.color === "neon-blue" &&
                      "bg-gradient-to-r from-neon-blue/20 to-neon-blue/40 border border-neon-blue/30",
                    value.color === "neon-purple" &&
                      "bg-gradient-to-r from-neon-purple/20 to-neon-purple/40 border border-neon-purple/30",
                    value.color === "neon-red" &&
                      "bg-gradient-to-r from-neon-red/20 to-neon-red/40 border border-neon-red/30",
                    value.color === "neon-cyan" &&
                      "bg-gradient-to-r from-neon-cyan/20 to-neon-cyan/40 border border-neon-cyan/30",
                    value.color === "neon-pink" &&
                      "bg-gradient-to-r from-neon-pink/20 to-neon-pink/40 border border-neon-pink/30",
                  )}
                >
                  <value.icon
                    className={cn(
                      "w-7 h-7",
                      value.color === "neon-blue" && "text-neon-blue",
                      value.color === "neon-purple" && "text-neon-purple",
                      value.color === "neon-red" && "text-neon-red",
                      value.color === "neon-cyan" && "text-neon-cyan",
                      value.color === "neon-pink" && "text-neon-pink",
                    )}
                  />
                </div>
                <h3 className="font-orbitron font-semibold text-lg text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-orbitron font-bold text-4xl md:text-5xl text-white mb-6">
              <span className="text-glow-purple">The</span>{" "}
              <span className="text-glow-blue">Pack</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Meet the visionaries behind Catrink who dare to think differently
              and push the boundaries of what's possible.
            </p>
          </motion.div>

          <div className="glass-card p-12 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-red flex items-center justify-center animate-float">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="font-orbitron font-bold text-3xl text-white mb-6">
                United by Purpose
              </h3>
              <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed mb-8">
                Our diverse team of scientists, designers, marketers, and cat
                enthusiasts work together with one shared mission: to help you
                discover the extraordinary potential that lies within.
              </p>
              <div className="flex justify-center space-x-8 text-sm text-white/50">
                <div>
                  <div className="font-orbitron font-bold text-2xl text-neon-blue mb-1">
                    50+
                  </div>
                  <div>Team Members</div>
                </div>
                <div>
                  <div className="font-orbitron font-bold text-2xl text-neon-purple mb-1">
                    15+
                  </div>
                  <div>Countries</div>
                </div>
                <div>
                  <div className="font-orbitron font-bold text-2xl text-neon-red mb-1">
                    100%
                  </div>
                  <div>Cat Lovers</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-card p-12 text-center"
          >
            <h2 className="font-orbitron font-bold text-4xl md:text-5xl text-white mb-6">
              <span className="text-glow-cyan">Ready to Unleash</span>
              <br />
              <span className="text-glow-red">Your Inner Cat?</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed">
              Join millions of energy seekers who have discovered their true
              potential with Catrink. The hunt for greatness begins now.
            </p>
            <Link to="/flavours" className="catrink-button text-lg">
              Explore Flavours
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Chatbot */}
      <MeowChatbot />
    </Layout>
  );
};

export default About;

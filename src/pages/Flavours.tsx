import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Zap,
  Droplets,
  ShoppingCart,
} from "lucide-react";
import Layout from "@/components/Layout";
import MeowChatbot from "@/components/MeowChatbot";
import { cn } from "@/lib/utils";

interface Flavor {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  color: string;
  ingredients: string[];
  energyLevel: "Medium" | "High" | "Ultra";
  rating: number;
  reviews: number;
  price: number;
  featured?: boolean;
}

const Flavours = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const flavors: Flavor[] = [
    {
      id: "mango-bluster",
      name: "Mango Bluster",
      tagline: "Tropical Thunder Unleashed",
      description:
        "Experience the explosive taste of tropical mango combined with our signature energy blend. This exotic fusion awakens your primal instincts while delivering a smooth, refreshing taste that'll transport you to a jungle paradise. Perfect for those who want to channel their inner wild cat.",
      image: "🥭",
      color: "from-orange-400 via-yellow-500 to-red-500",
      ingredients: [
        "Natural Mango Extract",
        "Taurine",
        "B-Vitamins",
        "Natural Caffeine",
        "Ginseng Root",
        "Electrolytes",
      ],
      energyLevel: "High",
      rating: 4.8,
      reviews: 1247,
      price: 4.99,
      featured: true,
    },
    {
      id: "neon-night",
      name: "Neon Night",
      tagline: "Hunt in the Darkness",
      description:
        "A mysterious dark berry blend designed for nocturnal predators. Rich blackberry and blueberry flavors create an intense taste experience that fuels late-night adventures and gaming sessions.",
      image: "🌙",
      color: "from-purple-600 via-indigo-600 to-blue-700",
      ingredients: [
        "Dark Berry Complex",
        "Taurine",
        "L-Theanine",
        "Natural Caffeine",
        "Adaptogens",
      ],
      energyLevel: "Ultra",
      rating: 4.9,
      reviews: 892,
      price: 5.49,
    },
    {
      id: "arctic-prowl",
      name: "Arctic Prowl",
      tagline: "Ice Cold Precision",
      description:
        "Channel the focus of a snow leopard with this icy mint energy drink. The refreshing arctic mint provides a cooling sensation while sharpening your reflexes.",
      image: "❄️",
      color: "from-cyan-400 via-blue-500 to-indigo-600",
      ingredients: [
        "Arctic Mint",
        "Menthol",
        "B-Vitamins",
        "Natural Caffeine",
        "Cooling Agents",
      ],
      energyLevel: "Medium",
      rating: 4.7,
      reviews: 634,
      price: 4.99,
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % flavors.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + flavors.length) % flavors.length);
  };

  const currentFlavor = flavors[currentSlide];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="font-orbitron font-black text-5xl md:text-7xl text-white mb-6">
              <span className="text-glow-blue">Epic</span>{" "}
              <span className="text-glow-purple">Flavours</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Discover our electrifying collection of energy drinks, each
              crafted to awaken different aspects of your inner cat.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Flavor Carousel */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full glass-card hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full glass-card hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Carousel Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px]"
              >
                {/* Flavor Image & Visual */}
                <div className="relative">
                  <div className="relative z-10 text-center">
                    {/* Large Flavor Icon */}
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-64 h-64 mx-auto mb-8 rounded-full flex items-center justify-center text-9xl relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${currentFlavor.color.replace("from-", "").replace(" via-", ", ").replace(" to-", ", ")})`,
                      }}
                    >
                      <div className="text-white/20 absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                      <span className="relative z-10">
                        {currentFlavor.image}
                      </span>

                      {/* Liquid Animation */}
                      <div className="absolute bottom-0 left-0 right-0 h-1/3 liquid-animation">
                        <motion.div
                          animate={{
                            transform: [
                              "translateX(-100%) skewX(-10deg)",
                              "translateX(100%) skewX(10deg)",
                            ],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        />
                      </div>
                    </motion.div>

                    {/* Floating Elements */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-4 h-4 rounded-full opacity-30"
                        style={{
                          background: `linear-gradient(45deg, ${currentFlavor.color.split(" ")[0].replace("from-", "")}, ${currentFlavor.color.split(" ")[2].replace("to-", "")})`,
                        }}
                        animate={{
                          x: [0, Math.random() * 100 - 50],
                          y: [0, Math.random() * 100 - 50],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Flavor Details */}
                <div className="space-y-8">
                  {/* Featured Badge */}
                  {currentFlavor.featured && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-neon-red to-neon-purple text-white text-sm font-orbitron font-semibold"
                    >
                      <Star className="w-4 h-4 fill-current" />
                      <span>Featured Flavor</span>
                    </motion.div>
                  )}

                  {/* Name & Tagline */}
                  <div>
                    <h2 className="font-orbitron font-black text-4xl md:text-5xl text-white mb-4">
                      {currentFlavor.name}
                    </h2>
                    <p className="text-xl text-neon-cyan font-orbitron font-medium">
                      {currentFlavor.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-lg text-white/70 leading-relaxed">
                    {currentFlavor.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="glass-card p-4 text-center">
                      <Zap
                        className={cn(
                          "w-8 h-8 mx-auto mb-2",
                          currentFlavor.energyLevel === "Ultra" &&
                            "text-neon-red",
                          currentFlavor.energyLevel === "High" &&
                            "text-neon-purple",
                          currentFlavor.energyLevel === "Medium" &&
                            "text-neon-blue",
                        )}
                      />
                      <div className="font-orbitron font-bold text-white text-sm">
                        {currentFlavor.energyLevel}
                      </div>
                      <div className="text-white/60 text-xs">Energy</div>
                    </div>

                    <div className="glass-card p-4 text-center">
                      <Star className="w-8 h-8 mx-auto mb-2 text-yellow-400 fill-current" />
                      <div className="font-orbitron font-bold text-white text-sm">
                        {currentFlavor.rating}★
                      </div>
                      <div className="text-white/60 text-xs">
                        {currentFlavor.reviews} reviews
                      </div>
                    </div>

                    <div className="glass-card p-4 text-center">
                      <Droplets className="w-8 h-8 mx-auto mb-2 text-neon-cyan" />
                      <div className="font-orbitron font-bold text-white text-sm">
                        ${currentFlavor.price}
                      </div>
                      <div className="text-white/60 text-xs">Price</div>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div className="glass-card p-6">
                    <h4 className="font-orbitron font-semibold text-white mb-4 flex items-center">
                      <Droplets className="w-5 h-5 text-neon-cyan mr-2" />
                      Key Ingredients
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentFlavor.ingredients.map((ingredient, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    to="/shop"
                    className="catrink-button w-full text-lg flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart - ${currentFlavor.price}</span>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slide Indicators */}
            <div className="flex justify-center space-x-3 mt-12">
              {flavors.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    currentSlide === index
                      ? "bg-gradient-to-r from-neon-blue to-neon-purple"
                      : "bg-white/20 hover:bg-white/40",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Flavors Grid */}
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
              <span className="text-glow-red">Complete</span>{" "}
              <span className="text-glow-cyan">Collection</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Explore our full range of energy drinks, each designed to unlock
              different aspects of your potential.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {flavors.map((flavor, index) => (
              <motion.div
                key={flavor.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => setCurrentSlide(index)}
              >
                <div
                  className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl"
                  style={{
                    background: `linear-gradient(135deg, ${flavor.color.replace("from-", "").replace(" via-", ", ").replace(" to-", ", ")})`,
                  }}
                >
                  {flavor.image}
                </div>
                <h3 className="font-orbitron font-bold text-xl text-white mb-2">
                  {flavor.name}
                </h3>
                <p className="text-neon-cyan text-sm mb-4">{flavor.tagline}</p>
                <div className="flex justify-center items-center space-x-4 text-sm text-white/60">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    {flavor.rating}
                  </div>
                  <div className="font-orbitron font-bold text-neon-green">
                    ${flavor.price}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <MeowChatbot />
    </Layout>
  );
};

export default Flavours;

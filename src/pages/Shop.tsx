import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, Minus, Star, Zap, Filter } from "lucide-react";
import Layout from "@/components/Layout";
import MeowChatbot from "@/components/MeowChatbot";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  flavor: string;
  energy: string;
  rating: number;
  reviews: number;
  category: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const Shop = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const products: Product[] = [
    {
      id: "1",
      name: "Mango Bluster",
      price: 4.99,
      image: "🥭",
      description:
        "Tropical mango energy with a wild twist. Unleash your inner jungle cat with this exotic blend.",
      flavor: "Mango Tropical",
      energy: "High",
      rating: 4.8,
      reviews: 1247,
      category: "tropical",
    },
    {
      id: "2",
      name: "Neon Night",
      price: 5.49,
      image: "🌙",
      description:
        "Dark berry fusion for nocturnal hunters. Perfect for late-night gaming sessions.",
      flavor: "Dark Berry",
      energy: "Ultra",
      rating: 4.9,
      reviews: 892,
      category: "berry",
    },
    {
      id: "3",
      name: "Arctic Prowl",
      price: 4.99,
      image: "❄️",
      description:
        "Icy mint energy that'll sharpen your reflexes like a snow leopard.",
      flavor: "Arctic Mint",
      energy: "Medium",
      rating: 4.7,
      reviews: 634,
      category: "mint",
    },
    {
      id: "4",
      name: "Citrus Strike",
      price: 4.79,
      image: "🍊",
      description:
        "Zesty citrus burst for lightning-fast reactions. The perfect hunting companion.",
      flavor: "Citrus Mix",
      energy: "High",
      rating: 4.6,
      reviews: 523,
      category: "citrus",
    },
    {
      id: "5",
      name: "Purple Phantom",
      price: 5.99,
      image: "👻",
      description:
        "Mysterious grape energy with supernatural power. Become the phantom predator.",
      flavor: "Purple Grape",
      energy: "Ultra",
      rating: 4.9,
      reviews: 756,
      category: "grape",
    },
    {
      id: "6",
      name: "Lightning Lime",
      price: 4.59,
      image: "⚡",
      description:
        "Electric lime energy that strikes like lightning. Quick, powerful, unstoppable.",
      flavor: "Electric Lime",
      energy: "High",
      rating: 4.5,
      reviews: 445,
      category: "citrus",
    },
  ];

  const categories = [
    { id: "all", name: "All Flavors", count: products.length },
    {
      id: "tropical",
      name: "Tropical",
      count: products.filter((p) => p.category === "tropical").length,
    },
    {
      id: "berry",
      name: "Berry",
      count: products.filter((p) => p.category === "berry").length,
    },
    {
      id: "mint",
      name: "Mint",
      count: products.filter((p) => p.category === "mint").length,
    },
    {
      id: "citrus",
      name: "Citrus",
      count: products.filter((p) => p.category === "citrus").length,
    },
    {
      id: "grape",
      name: "Grape",
      count: products.filter((p) => p.category === "grape").length,
    },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      );
    }
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

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
              <span className="text-glow-purple">Energy</span>{" "}
              <span className="text-glow-blue">Shop</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Discover our premium collection of energy drinks designed to
              awaken your inner cat. Each flavor crafted for maximum performance
              and taste.
            </p>
          </motion.div>

          {/* Cart Button */}
          <div className="fixed top-24 right-6 z-40">
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="catrink-button relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-neon-red rounded-full text-xs flex items-center justify-center text-white font-bold">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>

          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <Filter className="w-5 h-5 text-neon-cyan mr-2" />
              <span className="font-orbitron text-white">
                Filter by Category
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "px-6 py-2 rounded-lg font-orbitron font-medium transition-all duration-300",
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-neon-blue to-neon-purple text-white"
                      : "glass-card text-white/70 hover:text-white hover:bg-white/10",
                  )}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-6 hover:scale-105 transition-transform duration-300"
              >
                {/* Product Image */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-blue/20 via-neon-purple/20 to-neon-red/20 border border-neon-blue/30 flex items-center justify-center text-4xl">
                    {product.image}
                  </div>
                  <h3 className="font-orbitron font-bold text-xl text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">
                    {product.description}
                  </p>
                </div>

                {/* Product Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Flavor:</span>
                    <span className="text-neon-cyan">{product.flavor}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Energy Level:</span>
                    <span
                      className={cn(
                        "font-semibold",
                        product.energy === "Ultra" && "text-neon-red",
                        product.energy === "High" && "text-neon-purple",
                        product.energy === "Medium" && "text-neon-blue",
                      )}
                    >
                      {product.energy}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/70">Rating:</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white">{product.rating}</span>
                      <span className="text-white/50">({product.reviews})</span>
                    </div>
                  </div>
                </div>

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between">
                  <div className="font-orbitron font-bold text-2xl text-neon-green">
                    ${product.price}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-purple to-neon-red text-white font-orbitron font-semibold hover:scale-105 transition-transform duration-200 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          className="fixed top-0 right-0 w-96 h-full bg-slate-900/95 backdrop-blur-lg border-l border-white/10 z-50 p-6 overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-orbitron font-bold text-2xl text-white">
              Cart
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center text-white/60 mt-12">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Your cart is empty</p>
              <p className="text-sm mt-2">
                Add some energy drinks to get started!
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.product.id} className="glass-card p-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{item.product.image}</div>
                      <div className="flex-1">
                        <h4 className="font-orbitron font-semibold text-white text-sm">
                          {item.product.name}
                        </h4>
                        <p className="text-neon-cyan text-sm">
                          ${item.product.price}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-white font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-orbitron font-bold text-lg text-white">
                    Total:
                  </span>
                  <span className="font-orbitron font-bold text-2xl text-neon-green">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <button className="w-full catrink-button text-lg">
                  Checkout with Stripe
                </button>
                <p className="text-xs text-white/50 text-center mt-3">
                  Secure payment processing coming soon
                </p>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <MeowChatbot />
    </Layout>
  );
};

export default Shop;

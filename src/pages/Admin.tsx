import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Plus,
  Trash2,
  Edit,
  Package,
  Tag,
  Droplets,
  DollarSign,
  Star,
  Save,
  X,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  flavor: string;
  energy: "Medium" | "High" | "Ultra";
  category: string;
  image: string;
}

interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  minOrder: number;
  maxUses: number;
  currentUses: number;
  expiryDate: string;
  active: boolean;
}

interface Flavor {
  id: string;
  name: string;
  description: string;
  color: string;
  ingredients: string[];
  energy: "Medium" | "High" | "Ultra";
}

const Admin = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"product" | "coupon" | "flavor">(
    "product",
  );
  const [editingItem, setEditingItem] = useState<any>(null);

  // Sample data - in real app, this would come from Firestore
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Mango Bluster",
      price: 4.99,
      description:
        "Tropical mango energy with a wild twist. Unleash your inner jungle cat.",
      flavor: "Mango Tropical",
      energy: "High",
      category: "tropical",
      image: "🥭",
    },
    {
      id: "2",
      name: "Neon Night",
      price: 5.49,
      description: "Dark berry fusion for nocturnal hunters.",
      flavor: "Dark Berry",
      energy: "Ultra",
      category: "berry",
      image: "🌙",
    },
  ]);

  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: "1",
      code: "FIRSTCAT",
      discount: 20,
      type: "percentage",
      minOrder: 10,
      maxUses: 100,
      currentUses: 23,
      expiryDate: "2024-12-31",
      active: true,
    },
    {
      id: "2",
      code: "ENERGY50",
      discount: 5,
      type: "fixed",
      minOrder: 25,
      maxUses: 50,
      currentUses: 12,
      expiryDate: "2024-06-30",
      active: true,
    },
  ]);

  const [flavors, setFlavors] = useState<Flavor[]>([
    {
      id: "1",
      name: "Mango Bluster",
      description: "Tropical thunder unleashed",
      color: "from-orange-400 via-yellow-500 to-red-500",
      ingredients: [
        "Mango Extract",
        "Taurine",
        "B-Vitamins",
        "Natural Caffeine",
      ],
      energy: "High",
    },
    {
      id: "2",
      name: "Arctic Prowl",
      description: "Ice cold precision",
      color: "from-cyan-400 via-blue-500 to-indigo-600",
      ingredients: ["Arctic Mint", "Menthol", "B-Vitamins", "Cooling Agents"],
      energy: "Medium",
    },
  ]);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/login");
    }
  }, [isAdmin, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const openModal = (type: "product" | "coupon" | "flavor", item?: any) => {
    setModalType(type);
    setEditingItem(item || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const deleteItem = (type: string, id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      switch (type) {
        case "products":
          setProducts(products.filter((p) => p.id !== id));
          break;
        case "coupons":
          setCoupons(coupons.filter((c) => c.id !== id));
          break;
        case "flavors":
          setFlavors(flavors.filter((f) => f.id !== id));
          break;
      }
    }
  };

  if (!isAdmin) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-orbitron text-white mb-2">
              Access Denied
            </h1>
            <p className="text-white/60">
              You need admin privileges to access this page.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="relative py-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <h1 className="font-orbitron font-black text-5xl text-white mb-4">
                <span className="text-glow-cyan">Admin</span>{" "}
                <span className="text-glow-blue">Panel</span>
              </h1>
              <p className="text-xl text-white/70">
                Manage your Catrink empire with feline precision
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg glass-card hover:bg-red-500/20 transition-colors text-white"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex space-x-4 mb-8">
            {[
              { id: "products", label: "Products", icon: Package },
              { id: "coupons", label: "Coupons", icon: Tag },
              { id: "flavors", label: "Flavors", icon: Droplets },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center space-x-2 px-6 py-3 rounded-lg font-orbitron font-semibold transition-all duration-300",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-neon-blue to-neon-purple text-white"
                    : "glass-card text-white/70 hover:text-white hover:bg-white/10",
                )}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="glass-card p-8">
            {/* Products Tab */}
            {activeTab === "products" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-orbitron font-bold text-2xl text-white">
                    Products Management
                  </h2>
                  <button
                    onClick={() => openModal("product")}
                    className="catrink-button flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Product</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="glass-card p-6">
                      <div className="text-center mb-4">
                        <div className="text-4xl mb-2">{product.image}</div>
                        <h3 className="font-orbitron font-bold text-white">
                          {product.name}
                        </h3>
                        <p className="text-neon-cyan">${product.price}</p>
                      </div>
                      <div className="space-y-2 text-sm text-white/70 mb-4">
                        <p>Energy: {product.energy}</p>
                        <p>Category: {product.category}</p>
                        <p>Flavor: {product.flavor}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal("product", product)}
                          className="flex-1 px-3 py-2 bg-neon-blue/20 text-neon-blue rounded-lg hover:bg-neon-blue/30 transition-colors flex items-center justify-center"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteItem("products", product.id)}
                          className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coupons Tab */}
            {activeTab === "coupons" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-orbitron font-bold text-2xl text-white">
                    Coupons Management
                  </h2>
                  <button
                    onClick={() => openModal("coupon")}
                    className="catrink-button flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Coupon</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {coupons.map((coupon) => (
                    <div key={coupon.id} className="glass-card p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-orbitron font-bold text-xl text-white">
                            {coupon.code}
                          </h3>
                          <p className="text-neon-purple">
                            {coupon.type === "percentage"
                              ? `${coupon.discount}% off`
                              : `$${coupon.discount} off`}
                          </p>
                        </div>
                        <div
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-semibold",
                            coupon.active
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400",
                          )}
                        >
                          {coupon.active ? "Active" : "Inactive"}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-white/70 mb-4">
                        <p>Min Order: ${coupon.minOrder}</p>
                        <p>
                          Uses: {coupon.currentUses}/{coupon.maxUses}
                        </p>
                        <p>Expires: {coupon.expiryDate}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal("coupon", coupon)}
                          className="flex-1 px-3 py-2 bg-neon-purple/20 text-neon-purple rounded-lg hover:bg-neon-purple/30 transition-colors flex items-center justify-center"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteItem("coupons", coupon.id)}
                          className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Flavors Tab */}
            {activeTab === "flavors" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-orbitron font-bold text-2xl text-white">
                    Flavors Management
                  </h2>
                  <button
                    onClick={() => openModal("flavor")}
                    className="catrink-button flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Flavor</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {flavors.map((flavor) => (
                    <div key={flavor.id} className="glass-card p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${flavor.color.replace("from-", "").replace(" via-", ", ").replace(" to-", ", ")})`,
                          }}
                        >
                          <Droplets className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="font-orbitron font-bold text-xl text-white">
                            {flavor.name}
                          </h3>
                          <p className="text-neon-cyan">{flavor.description}</p>
                          <p className="text-white/60 text-sm">
                            Energy: {flavor.energy}
                          </p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <h4 className="text-white/80 text-sm font-semibold mb-2">
                          Ingredients:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {flavor.ingredients.map((ingredient, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/70"
                            >
                              {ingredient}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal("flavor", flavor)}
                          className="flex-1 px-3 py-2 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors flex items-center justify-center"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteItem("flavors", flavor.id)}
                          className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal for Add/Edit */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass-card p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-orbitron font-bold text-xl text-white">
                  {editingItem ? "Edit" : "Add"} {modalType}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form content would go here - simplified for demo */}
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue"
                    placeholder={`Enter ${modalType} name`}
                  />
                </div>
                {modalType === "product" && (
                  <>
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-purple"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Energy Level
                      </label>
                      <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-red">
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Ultra">Ultra</option>
                      </select>
                    </div>
                  </>
                )}
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 catrink-button flex items-center justify-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Admin;

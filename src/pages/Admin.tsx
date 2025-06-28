import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts, Product, Flavor } from "@/contexts/ProductContext";
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
  Image,
  Palette,
  Zap,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { cn } from "@/lib/utils";

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

const Admin = () => {
  const { isAdmin, logout } = useAuth();
  const {
    products,
    flavors,
    deleteProduct,
    deleteFlavor,
    addProduct,
    addFlavor,
    updateProduct,
    updateFlavor,
  } = useProducts();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"product" | "coupon" | "flavor">(
    "product",
  );
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    flavor: "",
    energy: "Medium" as "Medium" | "High" | "Ultra",
    rating: "",
    reviews: "",
    category: "",
  });

  const [flavorForm, setFlavorForm] = useState({
    name: "",
    tagline: "",
    description: "",
    image: "",
    color: "",
    ingredients: "",
    energyLevel: "Medium" as "Medium" | "High" | "Ultra",
    rating: "",
    reviews: "",
    price: "",
    featured: false,
  });

  const [couponForm, setCouponForm] = useState({
    code: "",
    discount: "",
    type: "percentage" as "percentage" | "fixed",
    minOrder: "",
    maxUses: "",
    expiryDate: "",
    active: true,
  });

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

  // Load coupons from localStorage on mount
  useEffect(() => {
    const savedCoupons = localStorage.getItem("catrink_coupons");
    if (savedCoupons) {
      try {
        setCoupons(JSON.parse(savedCoupons));
      } catch (error) {
        console.error("Error loading coupons:", error);
      }
    }
  }, []);

  // Save coupons to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("catrink_coupons", JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/login");
      return;
    }
  }, [isAdmin, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const tabs = [
    { id: "products", label: "Products", icon: Package },
    { id: "flavors", label: "Flavors", icon: Droplets },
    { id: "coupons", label: "Coupons", icon: Tag },
  ];

  const openModal = (type: "product" | "coupon" | "flavor", item?: any) => {
    setModalType(type);
    setEditingItem(item);

    if (type === "product") {
      if (item) {
        setProductForm({
          name: item.name,
          price: item.price.toString(),
          image: item.image,
          description: item.description,
          flavor: item.flavor,
          energy: item.energy,
          rating: item.rating.toString(),
          reviews: item.reviews.toString(),
          category: item.category,
        });
      } else {
        setProductForm({
          name: "",
          price: "",
          image: "",
          description: "",
          flavor: "",
          energy: "Medium",
          rating: "",
          reviews: "",
          category: "",
        });
      }
    } else if (type === "flavor") {
      if (item) {
        setFlavorForm({
          name: item.name,
          tagline: item.tagline,
          description: item.description,
          image: item.image,
          color: item.color,
          ingredients: item.ingredients.join(", "),
          energyLevel: item.energyLevel,
          rating: item.rating.toString(),
          reviews: item.reviews.toString(),
          price: item.price.toString(),
          featured: item.featured || false,
        });
      } else {
        setFlavorForm({
          name: "",
          tagline: "",
          description: "",
          image: "",
          color: "",
          ingredients: "",
          energyLevel: "Medium",
          rating: "",
          reviews: "",
          price: "",
          featured: false,
        });
      }
    } else if (type === "coupon") {
      if (item) {
        setCouponForm({
          code: item.code,
          discount: item.discount.toString(),
          type: item.type,
          minOrder: item.minOrder.toString(),
          maxUses: item.maxUses.toString(),
          expiryDate: item.expiryDate,
          active: item.active,
        });
      } else {
        setCouponForm({
          code: "",
          discount: "",
          type: "percentage",
          minOrder: "",
          maxUses: "",
          expiryDate: "",
          active: true,
        });
      }
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSaveProduct = () => {
    if (!productForm.name || !productForm.price) {
      alert("Please fill in all required fields");
      return;
    }

    const productData = {
      name: productForm.name,
      price: parseFloat(productForm.price),
      image: productForm.image || "🥤",
      description: productForm.description,
      flavor: productForm.flavor,
      energy: productForm.energy,
      rating: parseFloat(productForm.rating) || 4.5,
      reviews: parseInt(productForm.reviews) || 0,
      category: productForm.category,
    };

    if (editingItem) {
      updateProduct(editingItem.id, productData);
    } else {
      addProduct(productData);
    }

    closeModal();
    alert(
      `Product ${editingItem ? "updated" : "added"} successfully! Meow! 🐱`,
    );
  };

  const handleSaveFlavor = () => {
    if (!flavorForm.name || !flavorForm.price) {
      alert("Please fill in all required fields");
      return;
    }

    const flavorData = {
      name: flavorForm.name,
      tagline: flavorForm.tagline,
      description: flavorForm.description,
      image: flavorForm.image || "🥤",
      color: flavorForm.color || "from-blue-400 to-purple-500",
      ingredients: flavorForm.ingredients.split(",").map((ing) => ing.trim()),
      energyLevel: flavorForm.energyLevel,
      rating: parseFloat(flavorForm.rating) || 4.5,
      reviews: parseInt(flavorForm.reviews) || 0,
      price: parseFloat(flavorForm.price),
      featured: flavorForm.featured,
    };

    if (editingItem) {
      updateFlavor(editingItem.id, flavorData);
    } else {
      addFlavor(flavorData);
    }

    closeModal();
    alert(`Flavor ${editingItem ? "updated" : "added"} successfully! Meow! 🐱`);
  };

  const deleteItem = (type: string, id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      if (type === "products") {
        deleteProduct(id);
      } else if (type === "flavors") {
        deleteFlavor(id);
      }
      alert("Item deleted successfully!");
    }
  };

  if (!isAdmin) {
    return null;
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
            className="mb-12"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-orbitron font-black text-5xl text-white mb-4">
                  <span className="text-glow-blue">Admin</span>{" "}
                  <span className="text-glow-purple">Dashboard</span>
                </h1>
                <p className="text-xl text-white/70">
                  Manage products, flavors, and coupons for Catrink
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-4 py-2 glass-card">
                  <Shield className="w-5 h-5 text-neon-cyan" />
                  <span className="text-white font-orbitron">
                    Administrator
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-8">
            {tabs.map((tab) => (
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
                        <p>
                          Rating: {product.rating} ⭐ ({product.reviews}{" "}
                          reviews)
                        </p>
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
                      <div className="text-center mb-4">
                        <div className="text-4xl mb-2">{flavor.image}</div>
                        <h3 className="font-orbitron font-bold text-white">
                          {flavor.name}
                        </h3>
                        <p className="text-neon-purple text-sm">
                          {flavor.tagline}
                        </p>
                        <p className="text-neon-cyan">${flavor.price}</p>
                      </div>
                      <div className="space-y-2 text-sm text-white/70 mb-4">
                        <p>Energy: {flavor.energyLevel}</p>
                        <p>Featured: {flavor.featured ? "Yes" : "No"}</p>
                        <p>
                          Ingredients:{" "}
                          {flavor.ingredients.slice(0, 3).join(", ")}
                        </p>
                        <p>
                          Rating: {flavor.rating} ⭐ ({flavor.reviews} reviews)
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal("flavor", flavor)}
                          className="flex-1 px-3 py-2 bg-neon-purple/20 text-neon-purple rounded-lg hover:bg-neon-purple/30 transition-colors flex items-center justify-center"
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
                      <div className="space-y-2 text-sm text-white/70">
                        <p>Min Order: ${coupon.minOrder}</p>
                        <p>
                          Uses: {coupon.currentUses}/{coupon.maxUses}
                        </p>
                        <p>Expires: {coupon.expiryDate}</p>
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
              className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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

              {/* Product Form */}
              {modalType === "product" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue"
                        placeholder="Product name"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Price *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-purple"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Image (Emoji)
                      </label>
                      <input
                        type="text"
                        value={productForm.image}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            image: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan"
                        placeholder="🥤"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Energy Level
                      </label>
                      <select
                        value={productForm.energy}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            energy: e.target.value as any,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-red"
                      >
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Ultra">Ultra</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Flavor
                      </label>
                      <input
                        type="text"
                        value={productForm.flavor}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            flavor: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-pink"
                        placeholder="Flavor name"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        value={productForm.category}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue"
                        placeholder="tropical, citrus, etc"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Rating
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={productForm.rating}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            rating: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
                        placeholder="4.5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-semibold mb-2">
                      Reviews Count
                    </label>
                    <input
                      type="number"
                      value={productForm.reviews}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          reviews: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-purple"
                      placeholder="1247"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-semibold mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan resize-none"
                      placeholder="Product description..."
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProduct}
                      className="flex-1 catrink-button flex items-center justify-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Product</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Flavor Form */}
              {modalType === "flavor" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={flavorForm.name}
                        onChange={(e) =>
                          setFlavorForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue"
                        placeholder="Flavor name"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Price *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={flavorForm.price}
                        onChange={(e) =>
                          setFlavorForm((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-purple"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-semibold mb-2">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={flavorForm.tagline}
                      onChange={(e) =>
                        setFlavorForm((prev) => ({
                          ...prev,
                          tagline: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan"
                      placeholder="Tropical Thunder Unleashed"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Image (Emoji)
                      </label>
                      <input
                        type="text"
                        value={flavorForm.image}
                        onChange={(e) =>
                          setFlavorForm((prev) => ({
                            ...prev,
                            image: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-pink"
                        placeholder="🥭"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Energy Level
                      </label>
                      <select
                        value={flavorForm.energyLevel}
                        onChange={(e) =>
                          setFlavorForm((prev) => ({
                            ...prev,
                            energyLevel: e.target.value as any,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-red"
                      >
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Ultra">Ultra</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Rating
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={flavorForm.rating}
                        onChange={(e) =>
                          setFlavorForm((prev) => ({
                            ...prev,
                            rating: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
                        placeholder="4.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Color Gradient
                      </label>
                      <input
                        type="text"
                        value={flavorForm.color}
                        onChange={(e) =>
                          setFlavorForm((prev) => ({
                            ...prev,
                            color: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue"
                        placeholder="from-orange-400 via-yellow-500 to-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Reviews Count
                      </label>
                      <input
                        type="number"
                        value={flavorForm.reviews}
                        onChange={(e) =>
                          setFlavorForm((prev) => ({
                            ...prev,
                            reviews: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-purple"
                        placeholder="1247"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-semibold mb-2">
                      Ingredients (comma separated)
                    </label>
                    <input
                      type="text"
                      value={flavorForm.ingredients}
                      onChange={(e) =>
                        setFlavorForm((prev) => ({
                          ...prev,
                          ingredients: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan"
                      placeholder="Natural Mango Extract, Taurine, B-Vitamins, Natural Caffeine"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-semibold mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={flavorForm.description}
                      onChange={(e) =>
                        setFlavorForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-pink resize-none"
                      placeholder="Flavor description..."
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={flavorForm.featured}
                      onChange={(e) =>
                        setFlavorForm((prev) => ({
                          ...prev,
                          featured: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 rounded border-2 border-white/20 bg-white/5 text-neon-blue focus:ring-neon-blue"
                    />
                    <label className="text-white font-orbitron">
                      Featured Flavor
                    </label>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveFlavor}
                      className="flex-1 catrink-button flex items-center justify-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Flavor</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Coupon Form - Simplified */}
              {modalType === "coupon" && (
                <div className="space-y-4">
                  <p className="text-white/60 text-center">
                    Coupon management coming soon...
                  </p>
                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={closeModal}
                      className="w-full px-4 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Admin;

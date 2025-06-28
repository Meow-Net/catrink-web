import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts, Product, Flavor } from "@/contexts/ProductContext";
import { useOrders } from "@/contexts/OrderContext";
import {
  Shield,
  Plus,
  Trash2,
  Edit,
  Package,
  Tag,
  Users,
  ShoppingBag,
  Settings,
  Save,
  X,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  orders: number;
  totalSpent: number;
  status: "active" | "inactive" | "banned";
  avatar: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
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
  const { orders } = useOrders();
  const navigate = useNavigate();

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<
    "product" | "coupon" | "flavor" | "user"
  >("product");
  const [editingItem, setEditingItem] = useState<any>(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock users data - in real app, this would come from a user management system
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      joinDate: "2024-01-15",
      orders: 5,
      totalSpent: 87.45,
      status: "active",
      avatar: "👤",
      address: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1987654321",
      joinDate: "2024-02-20",
      orders: 3,
      totalSpent: 45.99,
      status: "active",
      avatar: "👩",
    },
  ]);

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

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "active" as "active" | "inactive" | "banned",
    password: "",
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

  // Load coupons and users from localStorage
  useEffect(() => {
    const savedCoupons = localStorage.getItem("catrink_coupons");
    const savedUsers = localStorage.getItem("catrink_admin_users");

    if (savedCoupons) {
      try {
        setCoupons(JSON.parse(savedCoupons));
      } catch (error) {
        console.error("Error loading coupons:", error);
      }
    }

    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (error) {
        console.error("Error loading users:", error);
      }
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem("catrink_coupons", JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem("catrink_admin_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/login");
      return;
    }
  }, [isAdmin, navigate]);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "products", label: "Products", icon: Package },
    { id: "flavors", label: "Flavors", icon: Tag },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "users", label: "Users", icon: Users },
    { id: "coupons", label: "Coupons", icon: Tag },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const openModal = (
    type: "product" | "coupon" | "flavor" | "user",
    item?: any,
  ) => {
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
    } else if (type === "user") {
      if (item) {
        setUserForm({
          name: item.name,
          email: item.email,
          phone: item.phone,
          status: item.status,
          password: "",
        });
      } else {
        setUserForm({
          name: "",
          email: "",
          phone: "",
          status: "active",
          password: "",
        });
      }
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSaveUser = () => {
    if (!userForm.name || !userForm.email) {
      alert("Please fill in all required fields");
      return;
    }

    const userData: User = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      name: userForm.name,
      email: userForm.email,
      phone: userForm.phone,
      status: userForm.status,
      joinDate: editingItem
        ? editingItem.joinDate
        : new Date().toISOString().split("T")[0],
      orders: editingItem ? editingItem.orders : 0,
      totalSpent: editingItem ? editingItem.totalSpent : 0,
      avatar: editingItem ? editingItem.avatar : "👤",
      address: editingItem ? editingItem.address : undefined,
    };

    if (editingItem) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingItem.id ? userData : u)),
      );
    } else {
      setUsers((prev) => [...prev, userData]);
    }

    closeModal();
    alert(`User ${editingItem ? "updated" : "added"} successfully! Meow! 🐱`);
  };

  // Other save handlers (simplified versions of existing ones)
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

  const deleteItem = (type: string, id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      if (type === "products") {
        deleteProduct(id);
      } else if (type === "flavors") {
        deleteFlavor(id);
      } else if (type === "coupons") {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      } else if (type === "users") {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      }
      alert("Item deleted successfully!");
    }
  };

  // Dashboard stats
  const stats = {
    totalUsers: users.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    totalProducts: products.length,
    activeCoupons: coupons.filter((c) => c.active).length,
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredOrders = orders.filter(
    (order) =>
      order.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-900/50 border-r border-white/10 backdrop-blur-md relative"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-orbitron font-bold text-white">
                    Admin Panel
                  </h2>
                  <p className="text-xs text-white/60">Catrink Management</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                activeSection === item.id
                  ? "bg-neon-blue/20 text-neon-blue"
                  : "text-white/70 hover:text-white hover:bg-white/10",
              )}
            >
              <item.icon className="w-5 h-5" />
              {!sidebarCollapsed && (
                <span className="font-orbitron">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="font-orbitron">Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 border-b border-white/10 bg-slate-900/30 backdrop-blur-md px-6 flex items-center justify-between">
          <div>
            <h1 className="font-orbitron font-bold text-xl text-white capitalize">
              {activeSection === "dashboard"
                ? "Dashboard Overview"
                : activeSection}
            </h1>
            <p className="text-sm text-white/60">
              {activeSection === "dashboard"
                ? "Welcome back, Administrator"
                : `Manage ${activeSection}`}
            </p>
          </div>

          {/* Search Bar */}
          {(activeSection === "users" || activeSection === "orders") && (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search ${activeSection}...`}
                  className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue"
                />
              </div>
              {activeSection === "users" && (
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-purple"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="banned">Banned</option>
                </select>
              )}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6 h-[calc(100vh-4rem)] overflow-y-auto">
          {/* Dashboard */}
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Total Users</p>
                      <p className="text-2xl font-bold text-white">
                        {stats.totalUsers}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-neon-blue" />
                  </div>
                </div>

                <div className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Total Orders</p>
                      <p className="text-2xl font-bold text-white">
                        {stats.totalOrders}
                      </p>
                    </div>
                    <ShoppingBag className="w-8 h-8 text-neon-purple" />
                  </div>
                </div>

                <div className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Revenue</p>
                      <p className="text-2xl font-bold text-white">
                        ${stats.totalRevenue.toFixed(2)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-neon-green" />
                  </div>
                </div>

                <div className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Products</p>
                      <p className="text-2xl font-bold text-white">
                        {stats.totalProducts}
                      </p>
                    </div>
                    <Package className="w-8 h-8 text-neon-cyan" />
                  </div>
                </div>

                <div className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Active Coupons</p>
                      <p className="text-2xl font-bold text-white">
                        {stats.activeCoupons}
                      </p>
                    </div>
                    <Tag className="w-8 h-8 text-neon-red" />
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="glass-card p-6">
                <h3 className="font-orbitron font-bold text-xl text-white mb-4">
                  Recent Orders
                </h3>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-white">
                          {order.trackingId}
                        </p>
                        <p className="text-sm text-white/60">
                          {order.shippingAddress.fullName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-neon-green">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-sm text-white/60">
                          {order.orderDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users Management */}
          {activeSection === "users" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-orbitron font-bold text-2xl text-white">
                  Users Management
                </h2>
                <button
                  onClick={() => openModal("user")}
                  className="catrink-button flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add User</span>
                </button>
              </div>

              <div className="glass-card p-6">
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{user.avatar}</div>
                        <div>
                          <h3 className="font-semibold text-white">
                            {user.name}
                          </h3>
                          <p className="text-sm text-white/60">{user.email}</p>
                          <p className="text-xs text-white/40">
                            Joined: {user.joinDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-white/60">
                            {user.orders} orders
                          </p>
                          <p className="text-sm text-neon-green">
                            ${user.totalSpent.toFixed(2)}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-semibold",
                            user.status === "active" &&
                              "bg-green-500/20 text-green-400",
                            user.status === "inactive" &&
                              "bg-yellow-500/20 text-yellow-400",
                            user.status === "banned" &&
                              "bg-red-500/20 text-red-400",
                          )}
                        >
                          {user.status}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal("user", user)}
                            className="p-2 bg-neon-blue/20 text-neon-blue rounded-lg hover:bg-neon-blue/30 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteItem("users", user.id)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Orders Management */}
          {activeSection === "orders" && (
            <div>
              <h2 className="font-orbitron font-bold text-2xl text-white mb-6">
                Orders Management
              </h2>

              <div className="glass-card p-6">
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-4">
                            <h3 className="font-semibold text-white">
                              {order.trackingId}
                            </h3>
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs font-semibold",
                                order.status === "processing" &&
                                  "bg-blue-500/20 text-blue-400",
                                order.status === "shipped" &&
                                  "bg-purple-500/20 text-purple-400",
                                order.status === "delivered" &&
                                  "bg-green-500/20 text-green-400",
                              )}
                            >
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-white/60">
                            Customer: {order.shippingAddress.fullName}
                          </p>
                          <p className="text-sm text-white/60">
                            Date: {order.orderDate.toLocaleDateString()}
                          </p>
                          <div className="text-sm text-white/60">
                            Items:{" "}
                            {order.items
                              .map((item) => `${item.quantity}x ${item.name}`)
                              .join(", ")}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-neon-green text-lg">
                            ${order.totalAmount.toFixed(2)}
                          </p>
                          <p className="text-sm text-white/60">
                            {order.paymentMethod}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products, Flavors, Coupons sections remain similar to original but simplified */}
          {activeSection === "products" && (
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
        </div>
      </div>

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

              {/* User Form */}
              {modalType === "user" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={userForm.name}
                        onChange={(e) =>
                          setUserForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={userForm.email}
                        onChange={(e) =>
                          setUserForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-purple"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={userForm.phone}
                        onChange={(e) =>
                          setUserForm((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan"
                        placeholder="+1234567890"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Status
                      </label>
                      <select
                        value={userForm.status}
                        onChange={(e) =>
                          setUserForm((prev) => ({
                            ...prev,
                            status: e.target.value as any,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-red"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="banned">Banned</option>
                      </select>
                    </div>
                  </div>

                  {!editingItem && (
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        value={userForm.password}
                        onChange={(e) =>
                          setUserForm((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-pink"
                        placeholder="Enter password"
                      />
                    </div>
                  )}

                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveUser}
                      className="flex-1 catrink-button flex items-center justify-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save User</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;

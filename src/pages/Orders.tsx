import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Package,
  RefreshCw,
  Eye,
  Calendar,
  Truck,
  CheckCircle,
  AlertCircle,
  Copy,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import Layout from "@/components/Layout";
import MeowChatbot from "@/components/MeowChatbot";
import { useOrders } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const Orders = () => {
  const { orders, generateTrackingId, updateOrderStatus } = useOrders();
  const { currentUser, isAdmin } = useAuth();
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [copiedTrackingId, setCopiedTrackingId] = useState<string | null>(null);

  const regenerateTrackingCode = async (orderId: string) => {
    setRegeneratingId(orderId);

    // Simulate API call delay
    setTimeout(() => {
      const newTrackingId = generateTrackingId();
      // In a real app, you'd update the order in the database
      console.log(
        `Regenerated tracking ID for order ${orderId}: ${newTrackingId}`,
      );
      setRegeneratingId(null);

      // Show success message
      alert(`New tracking ID generated: ${newTrackingId}`);
    }, 1500);
  };

  const copyTrackingId = (trackingId: string) => {
    navigator.clipboard.writeText(trackingId);
    setCopiedTrackingId(trackingId);
    setTimeout(() => setCopiedTrackingId(null), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Package className="w-5 h-5 text-neon-blue" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-neon-purple" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "cancelled":
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Package className="w-5 h-5 text-neon-cyan" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "text-neon-blue bg-neon-blue/10 border-neon-blue/30";
      case "shipped":
        return "text-neon-purple bg-neon-purple/10 border-neon-purple/30";
      case "delivered":
        return "text-green-400 bg-green-500/10 border-green-500/30";
      case "cancelled":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      default:
        return "text-neon-cyan bg-neon-cyan/10 border-neon-cyan/30";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!currentUser && !isAdmin) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Package className="w-16 h-16 text-neon-blue mx-auto mb-4" />
            <h1 className="font-orbitron font-bold text-2xl text-white mb-4">
              Login Required
            </h1>
            <p className="text-white/60 mb-8">
              Please login to view your orders
            </p>
            <Link to="/login" className="catrink-button">
              Login
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="relative py-20 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <span className="text-glow-blue">My</span>{" "}
                  <span className="text-glow-purple">Orders</span>
                </h1>
                <p className="text-xl text-white/70">
                  Manage your Catrink energy drink orders and tracking codes
                </p>
              </div>
              <Link
                to="/shop"
                className="flex items-center space-x-2 px-6 py-3 rounded-lg glass-card hover:bg-white/10 transition-colors text-white"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </motion.div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-card p-12 text-center"
            >
              <Package className="w-16 h-16 text-neon-blue mx-auto mb-6 opacity-50" />
              <h2 className="font-orbitron font-bold text-2xl text-white mb-4">
                No Orders Yet
              </h2>
              <p className="text-white/70 mb-8 max-w-md mx-auto">
                You haven't placed any orders yet. Start shopping for Catrink
                energy drinks to awaken your inner cat!
              </p>
              <Link to="/shop" className="catrink-button">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Start Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-card p-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="font-orbitron font-bold text-xl text-white mb-2">
                            Order #{order.id}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-white/60">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(order.orderDate)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>•</span>
                              <span>{order.items.length} item(s)</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>•</span>
                              <span className="font-orbitron font-bold text-neon-green">
                                ${order.totalAmount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div
                          className={cn(
                            "flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-orbitron font-semibold border",
                            getStatusColor(order.status),
                          )}
                        >
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </div>

                      {/* Tracking ID */}
                      <div className="mb-6">
                        <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                          Tracking ID
                        </label>
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                            <span className="font-orbitron font-bold text-neon-cyan">
                              {order.trackingId}
                            </span>
                          </div>
                          <button
                            onClick={() => copyTrackingId(order.trackingId)}
                            className={cn(
                              "p-3 rounded-lg transition-all duration-200",
                              copiedTrackingId === order.trackingId
                                ? "bg-green-500/20 text-green-400"
                                : "glass-card hover:bg-white/10 text-white",
                            )}
                          >
                            <Copy className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => regenerateTrackingCode(order.id)}
                            disabled={regeneratingId === order.id}
                            className={cn(
                              "p-3 rounded-lg transition-all duration-200 glass-card hover:bg-white/10 text-white",
                              regeneratingId === order.id &&
                                "opacity-50 cursor-not-allowed",
                            )}
                          >
                            <RefreshCw
                              className={cn(
                                "w-5 h-5",
                                regeneratingId === order.id && "animate-spin",
                              )}
                            />
                          </button>
                        </div>
                        {copiedTrackingId === order.trackingId && (
                          <p className="text-green-400 text-xs mt-1">
                            Tracking ID copied! 🐱
                          </p>
                        )}
                      </div>

                      {/* Order Items */}
                      <div>
                        <label className="block text-white/80 text-sm font-orbitron font-medium mb-3">
                          Items Ordered
                        </label>
                        <div className="space-y-3">
                          {order.items.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="flex items-center space-x-4 p-3 glass-card"
                            >
                              <div className="text-2xl">{item.image}</div>
                              <div className="flex-1">
                                <h4 className="font-orbitron font-semibold text-white">
                                  {item.name}
                                </h4>
                                <p className="text-white/60 text-sm">
                                  Qty: {item.quantity} × $
                                  {item.price.toFixed(2)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-orbitron font-bold text-neon-cyan">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                      <div className="glass-card p-6">
                        <h4 className="font-orbitron font-bold text-white mb-4">
                          Order Actions
                        </h4>
                        <div className="space-y-3">
                          <Link
                            to={`/track-order?id=${order.trackingId}`}
                            className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white font-orbitron font-semibold hover:scale-105 transition-transform duration-200 flex items-center justify-center space-x-2"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Track Order</span>
                          </Link>

                          {order.status === "processing" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order.id, "cancelled")
                              }
                              className="w-full px-4 py-3 rounded-lg font-orbitron font-semibold text-white border-2 border-red-500/50 hover:bg-red-500/10 transition-all duration-300"
                            >
                              Cancel Order
                            </button>
                          )}

                          <button
                            onClick={() => regenerateTrackingCode(order.id)}
                            disabled={regeneratingId === order.id}
                            className={cn(
                              "w-full px-4 py-3 rounded-lg font-orbitron font-semibold text-white border-2 border-neon-cyan/50 hover:bg-neon-cyan/10 transition-all duration-300 flex items-center justify-center space-x-2",
                              regeneratingId === order.id &&
                                "opacity-50 cursor-not-allowed",
                            )}
                          >
                            <RefreshCw
                              className={cn(
                                "w-4 h-4",
                                regeneratingId === order.id && "animate-spin",
                              )}
                            />
                            <span>
                              {regeneratingId === order.id
                                ? "Regenerating..."
                                : "New Tracking ID"}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Delivery Info */}
                      <div className="glass-card p-6">
                        <h4 className="font-orbitron font-bold text-white mb-4">
                          Delivery Info
                        </h4>
                        <div className="space-y-2 text-sm text-white/70">
                          <div>
                            <span className="text-white/90">To:</span>
                            <p>{order.shippingAddress.fullName}</p>
                            <p>
                              {order.shippingAddress.city},{" "}
                              {order.shippingAddress.state}
                            </p>
                          </div>
                          <div className="pt-2 border-t border-white/10">
                            <span className="text-white/90">
                              Expected Delivery:
                            </span>
                            <p className="text-neon-green">
                              {formatDate(order.estimatedDelivery)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <MeowChatbot />
    </Layout>
  );
};

export default Orders;

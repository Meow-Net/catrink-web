import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams, Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  MapPin,
  Calendar,
  Search,
  AlertCircle,
  Clock,
  ArrowLeft,
} from "lucide-react";
import Layout from "@/components/Layout";
import MeowChatbot from "@/components/MeowChatbot";
import { useOrders } from "@/contexts/OrderContext";
import { cn } from "@/lib/utils";

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const initialTrackingId = searchParams.get("id") || "";
  const [trackingId, setTrackingId] = useState(initialTrackingId);
  const [searchTrackingId, setSearchTrackingId] = useState("");
  const { getOrderByTrackingId } = useOrders();

  const order = trackingId ? getOrderByTrackingId(trackingId) : null;

  const handleSearch = () => {
    setTrackingId(searchTrackingId);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const trackingSteps = [
    {
      status: "processing",
      title: "Order Confirmed",
      description: "Your order has been received and is being prepared",
      icon: Package,
      color: "neon-blue",
    },
    {
      status: "shipped",
      title: "Shipped",
      description: "Your order is on its way to you",
      icon: Truck,
      color: "neon-purple",
    },
    {
      status: "delivered",
      title: "Delivered",
      description: "Your order has been delivered",
      icon: CheckCircle,
      color: "green-400",
    },
  ];

  const getStepStatus = (step: string) => {
    if (!order) return "pending";
    const orderStatus = order.status;
    const statuses = ["processing", "shipped", "delivered"];
    const currentIndex = statuses.indexOf(orderStatus);
    const stepIndex = statuses.indexOf(step);

    if (stepIndex <= currentIndex) return "completed";
    if (stepIndex === currentIndex + 1) return "current";
    return "pending";
  };

  return (
    <Layout>
      <section className="relative py-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="font-orbitron font-black text-5xl md:text-6xl text-white mb-4">
              <span className="text-glow-blue">Track</span>{" "}
              <span className="text-glow-purple">Order</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Follow your Catrink energy drink journey from our labs to your
              doorstep
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card p-8 mb-8"
          >
            <h2 className="font-orbitron font-bold text-xl text-white mb-6 text-center">
              Enter Your Tracking ID
            </h2>
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={searchTrackingId}
                  onChange={(e) => setSearchTrackingId(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors font-orbitron"
                  placeholder="CAT-ABC123XYZ456"
                />
              </div>
              <button
                onClick={handleSearch}
                className="catrink-button px-8 flex items-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Track</span>
              </button>
            </div>
          </motion.div>

          {/* Order Found */}
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-8"
            >
              {/* Order Info Header */}
              <div className="glass-card p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center md:text-left">
                    <h3 className="font-orbitron font-bold text-lg text-white mb-2">
                      Tracking ID
                    </h3>
                    <p className="text-neon-cyan font-orbitron font-semibold">
                      {order.trackingId}
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="font-orbitron font-bold text-lg text-white mb-2">
                      Order Date
                    </h3>
                    <p className="text-white/70">
                      {formatDate(order.orderDate)}
                    </p>
                  </div>
                  <div className="text-center md:text-right">
                    <h3 className="font-orbitron font-bold text-lg text-white mb-2">
                      Total Amount
                    </h3>
                    <p className="text-neon-green font-orbitron font-bold text-xl">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tracking Progress */}
              <div className="glass-card p-8">
                <h3 className="font-orbitron font-bold text-2xl text-white mb-8 text-center">
                  Order Progress
                </h3>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-8 top-12 bottom-12 w-1 bg-gradient-to-b from-neon-blue via-neon-purple to-green-400 opacity-30"></div>

                  <div className="space-y-8">
                    {trackingSteps.map((step, index) => {
                      const status = getStepStatus(step.status);
                      const Icon = step.icon;

                      return (
                        <motion.div
                          key={step.status}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.6,
                            delay: 0.4 + index * 0.1,
                          }}
                          className="relative flex items-center space-x-6"
                        >
                          {/* Icon */}
                          <div
                            className={cn(
                              "relative w-16 h-16 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-300",
                              status === "completed" &&
                                `bg-${step.color}/20 border-${step.color} text-${step.color}`,
                              status === "current" &&
                                `bg-${step.color}/20 border-${step.color} text-${step.color} animate-pulse`,
                              status === "pending" &&
                                "bg-white/5 border-white/20 text-white/40",
                            )}
                          >
                            <Icon className="w-8 h-8" />
                            {status === "completed" && (
                              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent to-white/10 animate-pulse"></div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4
                                  className={cn(
                                    "font-orbitron font-bold text-lg",
                                    status === "completed" && "text-white",
                                    status === "current" && "text-neon-cyan",
                                    status === "pending" && "text-white/60",
                                  )}
                                >
                                  {step.title}
                                </h4>
                                <p className="text-white/70 text-sm mt-1">
                                  {step.description}
                                </p>
                              </div>

                              {/* Status Badge */}
                              <div
                                className={cn(
                                  "px-3 py-1 rounded-full text-xs font-orbitron font-semibold",
                                  status === "completed" &&
                                    "bg-green-500/20 text-green-400",
                                  status === "current" &&
                                    "bg-neon-blue/20 text-neon-blue",
                                  status === "pending" &&
                                    "bg-white/5 text-white/40",
                                )}
                              >
                                {status === "completed" && "Completed"}
                                {status === "current" && "In Progress"}
                                {status === "pending" && "Pending"}
                              </div>
                            </div>

                            {/* Timestamp for completed steps */}
                            {status === "completed" && (
                              <div className="flex items-center space-x-2 mt-3 text-white/50 text-xs">
                                <Clock className="w-4 h-4" />
                                <span>{formatDate(order.orderDate)}</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Estimated Delivery */}
                <div className="mt-8 p-6 bg-gradient-to-r from-neon-green/10 to-neon-blue/10 border border-neon-green/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-6 h-6 text-neon-green" />
                    <div>
                      <h4 className="font-orbitron font-bold text-white">
                        Estimated Delivery
                      </h4>
                      <p className="text-neon-green">
                        {formatDate(order.estimatedDelivery)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="glass-card p-8">
                <h3 className="font-orbitron font-bold text-xl text-white mb-6">
                  Order Items
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 glass-card"
                    >
                      <div className="text-3xl">{item.image}</div>
                      <div className="flex-1">
                        <h4 className="font-orbitron font-semibold text-white">
                          {item.name}
                        </h4>
                        <p className="text-white/60 text-sm">
                          Quantity: {item.quantity}
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

              {/* Shipping Address */}
              <div className="glass-card p-8">
                <h3 className="font-orbitron font-bold text-xl text-white mb-4 flex items-center">
                  <MapPin className="w-6 h-6 text-neon-red mr-3" />
                  Delivery Address
                </h3>
                <div className="text-white/70 leading-relaxed">
                  <p className="font-semibold text-white">
                    {order.shippingAddress.fullName}
                  </p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/shop" className="catrink-button flex-1 text-center">
                  Continue Shopping
                </Link>
                <Link
                  to="/contact"
                  className="px-6 py-3 rounded-lg font-orbitron font-semibold text-white border-2 border-neon-purple hover:bg-neon-purple/10 transition-all duration-300 text-center flex-1"
                >
                  Need Help?
                </Link>
              </div>
            </motion.div>
          )}

          {/* Order Not Found */}
          {trackingId && !order && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="glass-card p-12 text-center"
            >
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
              <h2 className="font-orbitron font-bold text-2xl text-white mb-4">
                Order Not Found
              </h2>
              <p className="text-white/70 mb-8 max-w-md mx-auto">
                We couldn't find an order with tracking ID "{trackingId}".
                Please check your tracking ID and try again.
              </p>
              <button
                onClick={() => {
                  setTrackingId("");
                  setSearchTrackingId("");
                }}
                className="catrink-button"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* No Search Yet */}
          {!trackingId && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="glass-card p-12 text-center"
            >
              <Package className="w-16 h-16 text-neon-blue mx-auto mb-6" />
              <h2 className="font-orbitron font-bold text-2xl text-white mb-4">
                Track Your Catrink Order
              </h2>
              <p className="text-white/70 mb-8 max-w-md mx-auto">
                Enter your 16-digit tracking ID above to see real-time updates
                on your energy drink delivery. Meow! 🐱
              </p>
              <Link to="/shop" className="catrink-button">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Shop
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <MeowChatbot />
    </Layout>
  );
};

export default TrackOrder;

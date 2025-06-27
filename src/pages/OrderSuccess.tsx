import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Calendar,
  Copy,
  ArrowRight,
  Mail,
  Phone,
  Star,
} from "lucide-react";
import Layout from "@/components/Layout";
import MeowChatbot from "@/components/MeowChatbot";
import { useOrders } from "@/contexts/OrderContext";
import { cn } from "@/lib/utils";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const trackingId = searchParams.get("tracking");
  const { getOrderByTrackingId } = useOrders();
  const [copied, setCopied] = useState(false);

  const order = trackingId ? getOrderByTrackingId(trackingId) : null;

  const copyTrackingId = () => {
    if (trackingId) {
      navigator.clipboard.writeText(trackingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Package className="w-6 h-6" />;
      case "shipped":
        return <Truck className="w-6 h-6" />;
      case "delivered":
        return <CheckCircle className="w-6 h-6" />;
      default:
        return <Package className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "text-neon-blue";
      case "shipped":
        return "text-neon-purple";
      case "delivered":
        return "text-green-400";
      default:
        return "text-neon-cyan";
    }
  };

  if (!order) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-orbitron font-bold text-4xl text-white mb-4">
              Order Not Found
            </h1>
            <p className="text-white/60 mb-8">
              The tracking ID you're looking for doesn't exist.
            </p>
            <Link to="/shop" className="catrink-button">
              Continue Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="relative py-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-neon-blue flex items-center justify-center animate-bounce">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="font-orbitron font-black text-5xl md:text-6xl text-white mb-4">
              <span className="text-glow-green">Order</span>{" "}
              <span className="text-glow-blue">Confirmed!</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Your inner cat is about to be awakened! We've received your order
              and it's being prepared with feline precision.
            </p>
          </motion.div>

          {/* Tracking ID Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card p-8 mb-8"
          >
            <div className="text-center">
              <h2 className="font-orbitron font-bold text-2xl text-white mb-4">
                Your Tracking ID
              </h2>
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="px-6 py-4 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30 rounded-lg">
                  <span className="font-orbitron font-bold text-2xl text-neon-cyan">
                    {order.trackingId}
                  </span>
                </div>
                <button
                  onClick={copyTrackingId}
                  className={cn(
                    "p-3 rounded-lg transition-all duration-200",
                    copied
                      ? "bg-green-500/20 text-green-400"
                      : "glass-card hover:bg-white/10 text-white",
                  )}
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              {copied && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-green-400 text-sm"
                >
                  Tracking ID copied to clipboard! 🐱
                </motion.p>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Details */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-8"
            >
              {/* Order Status */}
              <div className="glass-card p-6">
                <h3 className="font-orbitron font-bold text-xl text-white mb-4 flex items-center">
                  {getStatusIcon(order.status)}
                  <span className="ml-3">Order Status</span>
                </h3>
                <div className="space-y-4">
                  <div
                    className={cn(
                      "flex items-center space-x-3 p-4 rounded-lg border",
                      getStatusColor(order.status),
                      order.status === "processing" &&
                        "bg-neon-blue/10 border-neon-blue/30",
                      order.status === "shipped" &&
                        "bg-neon-purple/10 border-neon-purple/30",
                      order.status === "delivered" &&
                        "bg-green-500/10 border-green-500/30",
                    )}
                  >
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="font-orbitron font-semibold capitalize">
                        {order.status}
                      </p>
                      <p className="text-sm opacity-80">
                        {order.status === "processing" &&
                          "Your order is being prepared"}
                        {order.status === "shipped" &&
                          "Your order is on its way"}
                        {order.status === "delivered" && "Order delivered"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-white/70">
                    <div className="flex justify-between">
                      <span>Order Date:</span>
                      <span>{formatDate(order.orderDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Delivery:</span>
                      <span className="text-neon-green">
                        {formatDate(order.estimatedDelivery)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="glass-card p-6">
                <h3 className="font-orbitron font-bold text-xl text-white mb-4 flex items-center">
                  <MapPin className="w-6 h-6 text-neon-red mr-3" />
                  Shipping Address
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

              {/* Payment Method */}
              <div className="glass-card p-6">
                <h3 className="font-orbitron font-bold text-xl text-white mb-4">
                  Payment Method
                </h3>
                <p className="text-white/70 capitalize">
                  {order.paymentMethod}
                </p>
                {order.couponApplied && (
                  <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 text-sm">
                      Coupon "{order.couponApplied.code}" applied - $
                      {order.couponApplied.discount} discount
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-8"
            >
              {/* Items */}
              <div className="glass-card p-6">
                <h3 className="font-orbitron font-bold text-xl text-white mb-6">
                  Order Items
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
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

                <div className="border-t border-white/10 mt-6 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="font-orbitron font-bold text-xl text-white">
                      Total Amount:
                    </span>
                    <span className="font-orbitron font-bold text-2xl text-neon-green">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <Link
                  to={`/track-order?id=${order.trackingId}`}
                  className="w-full catrink-button flex items-center justify-center space-x-2"
                >
                  <Package className="w-5 h-5" />
                  <span>Track Your Order</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/shop"
                    className="px-6 py-3 rounded-lg font-orbitron font-semibold text-white border-2 border-neon-purple hover:bg-neon-purple/10 transition-all duration-300 text-center"
                  >
                    Shop More
                  </Link>
                  <Link
                    to="/contact"
                    className="px-6 py-3 rounded-lg font-orbitron font-semibold text-white border-2 border-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300 text-center"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>

              {/* Email Confirmation */}
              <div className="glass-card p-6 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 border border-neon-blue/30">
                <div className="text-center">
                  <Mail className="w-12 h-12 text-neon-blue mx-auto mb-4" />
                  <h3 className="font-orbitron font-bold text-lg text-white mb-2">
                    Confirmation Email Sent
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    We've sent an order confirmation to your email with all the
                    details. Keep this tracking ID safe to monitor your order's
                    journey! Meow! 🐱
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Thank You Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="glass-card p-12 text-center mt-12"
          >
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-8 h-8 text-yellow-400 fill-current mr-1"
                />
              ))}
            </div>
            <h2 className="font-orbitron font-bold text-3xl text-white mb-4">
              Thank You for Choosing Catrink!
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Your journey to awakening your inner cat begins now. Get ready to
              experience energy levels you never thought possible. We're
              purr-fectly excited to serve you!
            </p>
          </motion.div>
        </div>
      </section>

      <MeowChatbot />
    </Layout>
  );
};

export default OrderSuccess;

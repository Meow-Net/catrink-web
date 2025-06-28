import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import emailjs from "@emailjs/browser";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  MapPin,
  User,
  Mail,
  Phone,
  Shield,
  CheckCircle,
  ArrowLeft,
  Tag,
} from "lucide-react";
import Layout from "@/components/Layout";
import { cn } from "@/lib/utils";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface BillingInfo {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  method: "stripe" | "razorpay" | "paypal" | "card" | "upi";
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { addOrder, generateTrackingId } = useOrders();

  // EmailJS configuration
  const EMAILJS_SERVICE_ID = "service_c2wun1e";
  const EMAILJS_PUBLIC_KEY = "wI1Qo5uf_5A-iCy0u";

  // Send order notification email to admin
  const sendOrderNotificationEmail = async (orderData: any) => {
    try {
      // Format items list for email
      const itemsList = orderData.items
        .map(
          (item: any) =>
            `• ${item.quantity}x ${item.name} ${item.image} - $${(item.price * item.quantity).toFixed(2)}`,
        )
        .join("\n");

      // Calculate totals
      const subtotal = orderData.items.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0,
      );
      const shippingCost = shippingMethod === "pickup" ? 0 : shipping;
      const discountAmount = orderData.couponApplied
        ? orderData.couponApplied.discount
        : 0;

      const emailMessage = `
🐱 NEW CATRINK ORDER RECEIVED! 🐱

ORDER DETAILS:
═══════════════════════════
📦 Order ID: ${orderData.trackingId}
📅 Order Date: ${orderData.orderDate.toLocaleDateString()}
🚚 Delivery Method: ${shippingMethod === "pickup" ? "Store Pickup" : "Home Delivery"}
💳 Payment Method: ${orderData.paymentMethod.toUpperCase()}

CUSTOMER INFO:
═══════════════════════════
👤 Name: ${orderData.shippingAddress.fullName}
📧 Email: ${billingInfo.email || "Not provided"}
📱 Phone: ${billingInfo.phone || "Not provided"}

SHIPPING ADDRESS:
═══════════════════════════
📍 ${orderData.shippingAddress.street}
   ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zipCode}
   ${orderData.shippingAddress.country}

ITEMS ORDERED:
═══════════════════════════
${itemsList}

PRICING BREAKDOWN:
═══════════════════════════
💰 Subtotal: $${subtotal.toFixed(2)}
🚚 Shipping: $${shippingCost.toFixed(2)}
${orderData.couponApplied ? `🎟️ Coupon (${orderData.couponApplied.code}): -$${discountAmount.toFixed(2)}` : ""}
─────────────────────────────
💵 TOTAL: $${orderData.totalAmount.toFixed(2)}

📅 Estimated Delivery: ${orderData.estimatedDelivery.toLocaleDateString()}

🎯 This order is ready for processing!
Meow! 🐱
      `;

      const emailParams = {
        to_email: "flayermc.in@gmail.com",
        from_name: "Catrink Order System",
        subject: `🐱 New Order #${orderData.trackingId} - $${orderData.totalAmount.toFixed(2)}`,
        message: emailMessage,
        reply_to: billingInfo.email || "noreply@catrink.com",
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        "template_c2wun1e", // Using the same template as contact form
        emailParams,
        EMAILJS_PUBLIC_KEY,
      );

      console.log("Order notification email sent successfully");
    } catch (error) {
      console.error("Failed to send order notification email:", error);
      // Don't fail the order if email fails
    }
  };

  // Mock cart items - in real app, this would come from cart context
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "mango-bluster",
      name: "Mango Bluster",
      price: 4.99,
      image: "🥭",
      quantity: 2,
    },
  ]);

  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: "card",
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [processing, setProcessing] = useState(false);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item,
        ),
      );
    }
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const applyCoupon = () => {
    // Mock coupon validation
    if (couponCode.toUpperCase() === "FIRSTCAT") {
      setAppliedCoupon({ code: "FIRSTCAT", discount: 20 });
    } else if (couponCode.toUpperCase() === "ENERGY50") {
      setAppliedCoupon({ code: "ENERGY50", discount: 5 });
    } else {
      alert("Invalid coupon code");
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const discountAmount = appliedCoupon
    ? appliedCoupon.code === "FIRSTCAT"
      ? subtotal * 0.2
      : 5
    : 0;
  const tax = (subtotal - discountAmount) * 0.1; // 10% tax
  const shipping = shippingMethod === "express" ? 9.99 : 4.99;
  const total = subtotal - discountAmount + tax + shipping;

  const handlePlaceOrder = async () => {
    if (!agreeToTerms) {
      alert("Please agree to the Terms & Conditions");
      return;
    }

    if (!billingInfo.fullName || !billingInfo.email || !billingInfo.street) {
      alert("Please fill in all required billing information");
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Generate tracking ID
      const trackingId = generateTrackingId();

      // Create order
      const orderData = {
        trackingId,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount: shippingMethod === "pickup" ? total - shipping : total,
        status: "processing" as const,
        orderDate: new Date(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        shippingAddress: {
          fullName: billingInfo.fullName,
          street: billingInfo.street,
          city: billingInfo.city,
          state: billingInfo.state,
          zipCode: billingInfo.zipCode,
          country: billingInfo.country,
        },
        paymentMethod: paymentInfo.method,
        couponApplied: appliedCoupon,
      };

      addOrder(orderData);

      // Send order notification email to admin
      sendOrderNotificationEmail(orderData);

      setProcessing(false);

      // Redirect to success page with tracking ID
      navigate(`/order-success?tracking=${trackingId}`);
    }, 3000);
  };

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
                  <span className="text-glow-blue">Checkout</span>
                </h1>
                <p className="text-xl text-white/70">
                  Complete your order to awaken your inner cat
                </p>
              </div>
              <Link
                to="/shop"
                className="flex items-center space-x-2 px-6 py-3 rounded-lg glass-card hover:bg-white/10 transition-colors text-white"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Shop</span>
              </Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Cart Summary */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="glass-card p-8"
              >
                <h2 className="font-orbitron font-bold text-2xl text-white mb-6 flex items-center">
                  <ShoppingCart className="w-6 h-6 text-neon-blue mr-3" />
                  Cart Summary
                </h2>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 glass-card"
                    >
                      <div className="text-3xl">{item.image}</div>
                      <div className="flex-1">
                        <h3 className="font-orbitron font-semibold text-white">
                          {item.name}
                        </h3>
                        <p className="text-neon-cyan">${item.price}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
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
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-orbitron font-bold text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Billing Information */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="glass-card p-8"
              >
                <h2 className="font-orbitron font-bold text-2xl text-white mb-6 flex items-center">
                  <User className="w-6 h-6 text-neon-purple mr-3" />
                  Billing Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={billingInfo.fullName}
                      onChange={(e) =>
                        setBillingInfo({
                          ...billingInfo,
                          fullName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={billingInfo.email}
                      onChange={(e) =>
                        setBillingInfo({
                          ...billingInfo,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-colors"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={billingInfo.phone}
                      onChange={(e) =>
                        setBillingInfo({
                          ...billingInfo,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-red focus:ring-1 focus:ring-neon-red transition-colors"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={billingInfo.street}
                      onChange={(e) =>
                        setBillingInfo({
                          ...billingInfo,
                          street: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
                      placeholder="Enter street address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={billingInfo.city}
                      onChange={(e) =>
                        setBillingInfo({ ...billingInfo, city: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors"
                      placeholder="Enter city"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={billingInfo.state}
                      onChange={(e) =>
                        setBillingInfo({
                          ...billingInfo,
                          state: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-colors"
                      placeholder="Enter state"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={billingInfo.zipCode}
                      onChange={(e) =>
                        setBillingInfo({
                          ...billingInfo,
                          zipCode: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-red focus:ring-1 focus:ring-neon-red transition-colors"
                      placeholder="Enter ZIP code"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      Country *
                    </label>
                    <select
                      value={billingInfo.country}
                      onChange={(e) =>
                        setBillingInfo({
                          ...billingInfo,
                          country: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
                      required
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="IN">India</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Shipping Information */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="glass-card p-8"
              >
                <h2 className="font-orbitron font-bold text-2xl text-white mb-6 flex items-center">
                  <MapPin className="w-6 h-6 text-neon-red mr-3" />
                  Shipping Information
                </h2>

                <div className="space-y-6">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={sameAsBilling}
                      onChange={(e) => setSameAsBilling(e.target.checked)}
                      className="w-5 h-5 rounded border-2 border-white/20 bg-white/5 text-neon-blue focus:ring-neon-blue"
                    />
                    <span className="text-white/80">
                      Same as billing address
                    </span>
                  </label>

                  <div>
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      Shipping Method
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="shipping"
                          value="standard"
                          checked={shippingMethod === "standard"}
                          onChange={(e) => setShippingMethod(e.target.value)}
                          className="w-4 h-4 text-neon-blue focus:ring-neon-blue"
                        />
                        <span className="text-white/80">
                          Standard Shipping (5-7 days) - $4.99
                        </span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="shipping"
                          value="express"
                          checked={shippingMethod === "express"}
                          onChange={(e) => setShippingMethod(e.target.value)}
                          className="w-4 h-4 text-neon-blue focus:ring-neon-blue"
                        />
                        <span className="text-white/80">
                          Express Shipping (2-3 days) - $9.99
                        </span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="shipping"
                          value="pickup"
                          checked={shippingMethod === "pickup"}
                          onChange={(e) => setShippingMethod(e.target.value)}
                          className="w-4 h-4 text-neon-blue focus:ring-neon-blue"
                        />
                        <span className="text-white/80">
                          Store Pickup - Free
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="glass-card p-8"
              >
                <h2 className="font-orbitron font-bold text-2xl text-white mb-6 flex items-center">
                  <CreditCard className="w-6 h-6 text-neon-cyan mr-3" />
                  Payment Method
                </h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { id: "card", label: "Card" },
                      { id: "stripe", label: "Stripe" },
                      { id: "razorpay", label: "Razorpay" },
                      { id: "paypal", label: "PayPal" },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() =>
                          setPaymentInfo({
                            ...paymentInfo,
                            method: method.id as any,
                          })
                        }
                        className={cn(
                          "p-3 rounded-lg border-2 transition-colors font-orbitron font-semibold",
                          paymentInfo.method === method.id
                            ? "border-neon-blue bg-neon-blue/20 text-neon-blue"
                            : "border-white/20 bg-white/5 text-white/70 hover:border-white/40",
                        )}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>

                  {paymentInfo.method === "card" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.cardholderName}
                          onChange={(e) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              cardholderName: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors"
                          placeholder="Name on card"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.cardNumber}
                          onChange={(e) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              cardNumber: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-colors"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.expiryDate}
                          onChange={(e) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              expiryDate: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-red focus:ring-1 focus:ring-neon-red transition-colors"
                          placeholder="MM/YY"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.cvv}
                          onChange={(e) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              cvv: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* UPI Option for India */}
                  {billingInfo.country === "IN" && (
                    <div className="mt-4">
                      <button
                        onClick={() =>
                          setPaymentInfo({ ...paymentInfo, method: "upi" })
                        }
                        className={cn(
                          "w-full p-3 rounded-lg border-2 transition-colors font-orbitron font-semibold",
                          paymentInfo.method === "upi"
                            ? "border-neon-purple bg-neon-purple/20 text-neon-purple"
                            : "border-white/20 bg-white/5 text-white/70 hover:border-white/40",
                        )}
                      >
                        UPI / Digital Wallets
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="sticky top-24 space-y-8"
              >
                {/* Coupon Code */}
                <div className="glass-card p-6">
                  <h3 className="font-orbitron font-bold text-lg text-white mb-4 flex items-center">
                    <Tag className="w-5 h-5 text-neon-pink mr-2" />
                    Coupon Code
                  </h3>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-pink focus:ring-1 focus:ring-neon-pink transition-colors"
                      placeholder="Enter coupon code"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-4 py-2 bg-gradient-to-r from-neon-pink to-neon-purple rounded-lg text-white font-orbitron font-semibold hover:scale-105 transition-transform duration-200"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedCoupon && (
                    <div className="mt-3 flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">
                        Coupon "{appliedCoupon.code}" applied!
                      </span>
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div className="glass-card p-6">
                  <h3 className="font-orbitron font-bold text-lg text-white mb-4">
                    Order Summary
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-white/70">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-400">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-white/70">
                      <span>Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Shipping</span>
                      <span>
                        {shippingMethod === "pickup"
                          ? "Free"
                          : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="border-t border-white/10 pt-3">
                      <div className="flex justify-between font-orbitron font-bold text-lg text-neon-green">
                        <span>Total</span>
                        <span>
                          $
                          {shippingMethod === "pickup"
                            ? (total - shipping).toFixed(2)
                            : total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Confirmation */}
                <div className="glass-card p-6">
                  <label className="flex items-start space-x-3 mb-6">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded border-2 border-white/20 bg-white/5 text-neon-blue focus:ring-neon-blue"
                    />
                    <span className="text-white/80 text-sm leading-relaxed">
                      I agree to the{" "}
                      <a href="#" className="text-neon-cyan hover:underline">
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-neon-cyan hover:underline">
                        Privacy Policy
                      </a>
                    </span>
                  </label>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={!agreeToTerms || processing}
                    className={cn(
                      "w-full catrink-button text-lg py-4 flex items-center justify-center space-x-2",
                      (!agreeToTerms || processing) &&
                        "opacity-50 cursor-not-allowed",
                    )}
                  >
                    {processing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        <span>Place Order</span>
                      </>
                    )}
                  </button>

                  <div className="mt-4 flex items-center justify-center space-x-2 text-white/50 text-xs">
                    <Shield className="w-4 h-4" />
                    <span>
                      Your payment is secured with 256-bit SSL encryption
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;

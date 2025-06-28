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
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
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
            `${item.quantity}x ${item.name} ${item.image} - $${(item.price * item.quantity).toFixed(2)}`,
        )
        .join(", ");

      // Use the same parameter names as the contact form template
      const emailParams = {
        name: "Catrink Order System",
        email: billingInfo.email || "order@catrink.com",
        phone: billingInfo.phone || "N/A",
        subject: `🐱 NEW ORDER #${orderData.trackingId} - $${orderData.totalAmount.toFixed(2)}`,
        message: `NEW CATRINK ORDER RECEIVED!

ORDER ID: ${orderData.trackingId}
ORDER DATE: ${orderData.orderDate.toLocaleDateString()}
DELIVERY: ${shippingMethod === "pickup" ? "Store Pickup" : "Home Delivery"}
PAYMENT: ${orderData.paymentMethod.toUpperCase()}

CUSTOMER:
Name: ${orderData.shippingAddress.fullName}
Email: ${billingInfo.email || "Not provided"}
Phone: ${billingInfo.phone || "Not provided"}

ADDRESS:
${orderData.shippingAddress.street}
${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zipCode}
${orderData.shippingAddress.country}

ITEMS: ${itemsList}

TOTAL: $${orderData.totalAmount.toFixed(2)}
${orderData.couponApplied ? `COUPON: ${orderData.couponApplied.code} (-$${orderData.couponApplied.discount})` : ""}

DELIVERY DATE: ${orderData.estimatedDelivery.toLocaleDateString()}

This order is ready for processing! Meow!`,
      };

      console.log("Sending email with params:", emailParams);

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        "template_c2wun1e",
        emailParams,
        EMAILJS_PUBLIC_KEY,
      );

      console.log("Email sent successfully:", result);
    } catch (error) {
      console.error("Failed to send order notification email:", error);
      console.error("Error details:", error);
    }
  };

  // Mock cart items - in real app, this would come from cart context
  const [cartItems] = useState<CartItem[]>([
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

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: "stripe",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
  });

  const [shippingMethod, setShippingMethod] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");

  // Mock coupons - in real app, this would come from context
  const availableCoupons = [
    { code: "FIRSTCAT", discount: 20, type: "percentage", minOrder: 10 },
    { code: "ENERGY50", discount: 5, type: "fixed", minOrder: 25 },
  ];

  const applyCoupon = () => {
    setCouponError("");
    const coupon = availableCoupons.find(
      (c) => c.code.toLowerCase() === couponCode.toLowerCase(),
    );

    if (!coupon) {
      setCouponError("Invalid coupon code");
      return;
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    if (subtotal < coupon.minOrder) {
      setCouponError(
        `Minimum order amount is $${coupon.minOrder} for this coupon`,
      );
      return;
    }

    setAppliedCoupon(coupon);
    setCouponCode("");
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = shippingMethod === "delivery" ? 5.99 : 0;
  const tax = subtotal * 0.08; // 8% tax
  const discountAmount = appliedCoupon
    ? appliedCoupon.type === "percentage"
      ? (subtotal * appliedCoupon.discount) / 100
      : appliedCoupon.discount
    : 0;
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
    setTimeout(async () => {
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
      await sendOrderNotificationEmail(orderData);

      setProcessing(false);

      // Show success message
      alert(
        "Order placed successfully! Order confirmation email sent. Meow! 🐱",
      );

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
                  Complete your order and awaken your inner cat
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
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Billing Information */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="glass-card p-8"
              >
                <h2 className="font-orbitron font-bold text-2xl text-white mb-6 flex items-center">
                  <User className="w-6 h-6 text-neon-blue mr-3" />
                  Billing Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 text-sm font-semibold mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={billingInfo.fullName}
                      onChange={(e) =>
                        setBillingInfo((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-semibold mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={billingInfo.email}
                      onChange={(e) =>
                        setBillingInfo((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-semibold mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={billingInfo.phone}
                      onChange={(e) =>
                        setBillingInfo((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-semibold mb-2">
                      Country
                    </label>
                    <select
                      value={billingInfo.country}
                      onChange={(e) =>
                        setBillingInfo((prev) => ({
                          ...prev,
                          country: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-red focus:ring-1 focus:ring-neon-red transition-colors"
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="IN">India</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-white/80 text-sm font-semibold mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={billingInfo.street}
                      onChange={(e) =>
                        setBillingInfo((prev) => ({
                          ...prev,
                          street: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-pink focus:ring-1 focus:ring-neon-pink transition-colors"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-semibold mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={billingInfo.city}
                      onChange={(e) =>
                        setBillingInfo((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors"
                      placeholder="New York"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-semibold mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={billingInfo.state}
                      onChange={(e) =>
                        setBillingInfo((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-colors"
                      placeholder="NY"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-semibold mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={billingInfo.zipCode}
                      onChange={(e) =>
                        setBillingInfo((prev) => ({
                          ...prev,
                          zipCode: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
                      placeholder="10001"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Shipping Method */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="glass-card p-8"
              >
                <h2 className="font-orbitron font-bold text-2xl text-white mb-6 flex items-center">
                  <MapPin className="w-6 h-6 text-neon-red mr-3" />
                  Shipping Method
                </h2>

                <div className="space-y-4">
                  <div
                    className={cn(
                      "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                      shippingMethod === "delivery"
                        ? "border-neon-blue bg-neon-blue/10"
                        : "border-white/20 hover:border-white/40",
                    )}
                    onClick={() => setShippingMethod("delivery")}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-orbitron font-semibold text-white">
                          Home Delivery
                        </h3>
                        <p className="text-white/60 text-sm">
                          Delivered to your doorstep in 5-7 business days
                        </p>
                      </div>
                      <span className="text-neon-green font-bold">$5.99</span>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                      shippingMethod === "pickup"
                        ? "border-neon-purple bg-neon-purple/10"
                        : "border-white/20 hover:border-white/40",
                    )}
                    onClick={() => setShippingMethod("pickup")}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-orbitron font-semibold text-white">
                          Store Pickup
                        </h3>
                        <p className="text-white/60 text-sm">
                          Pick up from our store within 24 hours
                        </p>
                      </div>
                      <span className="text-neon-green font-bold">FREE</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment Information */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="glass-card p-8"
              >
                <h2 className="font-orbitron font-bold text-2xl text-white mb-6 flex items-center">
                  <CreditCard className="w-6 h-6 text-neon-green mr-3" />
                  Payment Method
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  {[
                    { id: "stripe", name: "Stripe", icon: "💳" },
                    { id: "razorpay", name: "Razorpay", icon: "🏦" },
                    { id: "paypal", name: "PayPal", icon: "💰" },
                    { id: "card", name: "Card", icon: "💸" },
                    { id: "upi", name: "UPI", icon: "📱" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() =>
                        setPaymentInfo((prev) => ({
                          ...prev,
                          method: method.id as any,
                        }))
                      }
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all duration-200 text-center",
                        paymentInfo.method === method.id
                          ? "border-neon-cyan bg-neon-cyan/10"
                          : "border-white/20 hover:border-white/40",
                      )}
                    >
                      <div className="text-2xl mb-2">{method.icon}</div>
                      <div className="text-white text-sm font-orbitron">
                        {method.name}
                      </div>
                    </button>
                  ))}
                </div>

                {paymentInfo.method === "card" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Card Holder Name
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.cardHolder}
                        onChange={(e) =>
                          setPaymentInfo((prev) => ({
                            ...prev,
                            cardHolder: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.cardNumber}
                        onChange={(e) =>
                          setPaymentInfo((prev) => ({
                            ...prev,
                            cardNumber: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-colors"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.expiryDate}
                        onChange={(e) =>
                          setPaymentInfo((prev) => ({
                            ...prev,
                            expiryDate: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
                        placeholder="MM/YY"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.cvv}
                        onChange={(e) =>
                          setPaymentInfo((prev) => ({
                            ...prev,
                            cvv: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-red focus:ring-1 focus:ring-neon-red transition-colors"
                        placeholder="123"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Cart Items */}
              <div className="glass-card p-6">
                <h2 className="font-orbitron font-bold text-xl text-white mb-6 flex items-center">
                  <ShoppingCart className="w-5 h-5 text-neon-blue mr-2" />
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg"
                    >
                      <div className="text-2xl">{item.image}</div>
                      <div className="flex-1">
                        <h3 className="font-orbitron font-semibold text-white">
                          {item.name}
                        </h3>
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

                {/* Coupon Section */}
                <div className="border-t border-white/10 pt-6 mb-6">
                  <h3 className="font-orbitron font-semibold text-white mb-4 flex items-center">
                    <Tag className="w-4 h-4 text-neon-purple mr-2" />
                    Coupon Code
                  </h3>

                  {appliedCoupon ? (
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="text-green-400 font-semibold">
                          {appliedCoupon.code}
                        </p>
                        <p className="text-green-300 text-xs">
                          {appliedCoupon.type === "percentage"
                            ? `${appliedCoupon.discount}% off`
                            : `$${appliedCoupon.discount} off`}
                        </p>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-purple"
                        placeholder="Enter coupon code"
                      />
                      <button
                        onClick={applyCoupon}
                        className="px-4 py-2 bg-neon-purple/20 text-neon-purple rounded-lg hover:bg-neon-purple/30 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  {couponError && (
                    <p className="text-red-400 text-sm mt-2">{couponError}</p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-white/10 pt-6 space-y-3">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-white/70">
                    <span>Shipping:</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-white/70">
                    <span>Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount:</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t border-white/10 pt-3 flex justify-between text-white font-orbitron font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-neon-green">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Terms and Place Order */}
              <div className="glass-card p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-2 border-white/20 bg-white/5 text-neon-blue focus:ring-neon-blue"
                    />
                    <label className="text-white/80 text-sm leading-relaxed">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-neon-blue hover:text-neon-cyan underline"
                      >
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-neon-blue hover:text-neon-cyan underline"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={processing || !agreeToTerms}
                    className={cn(
                      "w-full catrink-button flex items-center justify-center space-x-2 text-lg py-4",
                      (processing || !agreeToTerms) &&
                        "opacity-50 cursor-not-allowed",
                    )}
                  >
                    {processing ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing Order...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-6 h-6" />
                        <span>Place Order Securely</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center space-x-4 text-white/60 text-xs">
                    <div className="flex items-center space-x-1">
                      <Shield className="w-3 h-3" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>SSL Encrypted</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;

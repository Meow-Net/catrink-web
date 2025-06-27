import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MessageSquare,
  User,
  Phone,
  Send,
  CheckCircle,
  AlertCircle,
  MapPin,
  Clock,
} from "lucide-react";
import emailjs from "@emailjs/browser";
import Layout from "@/components/Layout";
import MeowChatbot from "@/components/MeowChatbot";
import { cn } from "@/lib/utils";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // EmailJS configuration
  const EMAILJS_SERVICE_ID = "service_c2wun1e";
  const EMAILJS_PUBLIC_KEY = "wI1Qo5uf_5A-iCy0u";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // EmailJS template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || "Not provided",
        subject:
          formData.subject ||
          "New Contact Form Submission from Catrink Website",
        message: formData.message,
        to_email: "flayermc.in@gmail.com",
        reply_to: formData.email,
      };

      // Send email using EmailJS
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        "template_default", // Using default template
        templateParams,
        EMAILJS_PUBLIC_KEY,
      );

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Email sending error:", error);
      setError(
        "Failed to send message. Please try again or contact us directly.",
      );
    } finally {
      setLoading(false);
    }
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
              <span className="text-glow-red">Get in</span>{" "}
              <span className="text-glow-cyan">Touch</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Have questions about Catrink? Want to unleash your feedback? We're
              all ears and ready to help you awaken your inner cat!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="glass-card p-8">
                <h2 className="font-orbitron font-bold text-3xl text-white mb-8">
                  <span className="text-glow-purple">Send us a</span>{" "}
                  <span className="text-glow-blue">Message</span>
                </h2>

                {/* Success Message */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 mb-6"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm">
                      Message sent successfully! We'll get back to you soon.
                      Meow! 🐱
                    </span>
                  </motion.div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 mb-6"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-colors"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-red focus:ring-1 focus:ring-neon-red transition-colors"
                        placeholder="Enter your phone number (optional)"
                      />
                    </div>
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      Subject
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
                        placeholder="What's this about?"
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-white/80 text-sm font-orbitron font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-pink focus:ring-1 focus:ring-neon-pink transition-colors resize-none"
                      placeholder="Tell us what's on your mind... Don't be shy, we love to hear from fellow cats! 🐱"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={cn(
                      "w-full catrink-button text-lg py-4 flex items-center justify-center space-x-2",
                      loading && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Contact Info Cards */}
              <div className="glass-card p-8">
                <h3 className="font-orbitron font-bold text-2xl text-white mb-6">
                  <span className="text-glow-cyan">Contact</span>{" "}
                  <span className="text-glow-purple">Information</span>
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-blue/20 to-neon-purple/40 border border-neon-blue/30 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-neon-blue" />
                    </div>
                    <div>
                      <h4 className="font-orbitron font-semibold text-white mb-1">
                        Email Us
                      </h4>
                      <p className="text-white/70 text-sm leading-relaxed">
                        For general inquiries and support
                      </p>
                      <a
                        href="mailto:flayermc.in@gmail.com"
                        className="text-neon-cyan hover:text-neon-purple transition-colors"
                      >
                        flayermc.in@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-purple/20 to-neon-red/40 border border-neon-purple/30 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-neon-purple" />
                    </div>
                    <div>
                      <h4 className="font-orbitron font-semibold text-white mb-1">
                        Headquarters
                      </h4>
                      <p className="text-white/70 text-sm leading-relaxed">
                        Neo Tokyo Energy District
                        <br />
                        Feline Labs, Building 9
                        <br />
                        Cat Reflex Avenue 42
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-red/20 to-neon-cyan/40 border border-neon-red/30 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-neon-red" />
                    </div>
                    <div>
                      <h4 className="font-orbitron font-semibold text-white mb-1">
                        Response Time
                      </h4>
                      <p className="text-white/70 text-sm leading-relaxed">
                        We typically respond within 24 hours
                        <br />
                        Business hours: 9AM - 6PM JST
                        <br />
                        (But cats are always active!)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="glass-card p-8">
                <h3 className="font-orbitron font-bold text-xl text-white mb-6">
                  <span className="text-glow-red">Quick</span>{" "}
                  <span className="text-glow-blue">Questions?</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-orbitron font-semibold text-white text-sm mb-2">
                      How fast does Catrink work?
                    </h4>
                    <p className="text-white/60 text-sm">
                      Like a cat pouncing on its prey - instant reflexes within
                      15 minutes!
                    </p>
                  </div>

                  <div>
                    <h4 className="font-orbitron font-semibold text-white text-sm mb-2">
                      Is it safe for daily consumption?
                    </h4>
                    <p className="text-white/60 text-sm">
                      Absolutely! Our formula is designed for daily energy
                      seekers who want sustained cat-like performance.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-orbitron font-semibold text-white text-sm mb-2">
                      Do you ship internationally?
                    </h4>
                    <p className="text-white/60 text-sm">
                      Yes! We deliver Catrink to energy seekers worldwide.
                      Shipping details available at checkout.
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat with MeowCat */}
              <div className="glass-card p-8 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 border border-neon-blue/30">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-red flex items-center justify-center animate-float">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-orbitron font-bold text-xl text-white mb-4">
                    Need Instant Help?
                  </h3>
                  <p className="text-white/70 text-sm mb-6 leading-relaxed">
                    Chat with MeowCat, our AI assistant! Get instant answers
                    about flavors, ingredients, and more. Every response comes
                    with a friendly "Meow!" 🐱
                  </p>
                  <button
                    onClick={() => {
                      // Open chatbot by clicking the chat button
                      const chatButton = document.querySelector(
                        '[class*="fixed bottom-6 right-6"]',
                      ) as HTMLElement;
                      if (chatButton) {
                        chatButton.click();
                      }
                    }}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-neon-purple to-neon-red text-white font-orbitron font-semibold hover:scale-105 transition-transform duration-200"
                  >
                    Start Chat
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <MeowChatbot />
    </Layout>
  );
};

export default Contact;

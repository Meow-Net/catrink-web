import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Zap,
  LogIn,
  LogOut,
  Shield,
  Package,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();
  const { currentUser, logout, isAdmin } = useAuth();
  const { orders, hasEverOrdered } = useOrders();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    setShowUserMenu(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
      setShowLogoutConfirm(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/flavours", label: "Flavours" },
    { path: "/shop", label: "Shop" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "glass-card backdrop-blur-lg border-b border-white/10"
            : "bg-transparent",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-neon-blue via-neon-purple to-neon-red flex items-center justify-center">
                <Zap className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <span className="font-orbitron font-bold text-xl md:text-2xl bg-gradient-to-r from-neon-blue via-neon-purple to-neon-red bg-clip-text text-transparent">
                CATRINK
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "font-orbitron font-medium transition-all duration-300 relative",
                    location.pathname === item.path
                      ? "text-neon-blue text-glow-blue"
                      : "text-white/80 hover:text-neon-purple hover:text-glow-purple",
                  )}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-blue to-neon-purple"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 rounded-lg glass-card hover:bg-white/10 transition-colors">
                <ShoppingCart className="w-5 h-5 text-white" />
              </button>

              {currentUser || isAdmin ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg glass-card hover:bg-white/10 transition-colors"
                  >
                    {isAdmin ? (
                      <Shield className="w-5 h-5 text-neon-cyan" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                    <span className="text-white text-sm">
                      {isAdmin ? "Admin" : currentUser?.email?.split("@")[0]}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-52 glass-card border border-white/10 rounded-lg py-2 z-50"
                      >
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>

                        <Link
                          to="/orders"
                          className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FileText className="w-4 h-4" />
                          <span>
                            My Orders{" "}
                            {orders.length > 0 && `(${orders.length})`}
                          </span>
                        </Link>

                        {currentUser && hasEverOrdered && (
                          <Link
                            to="/track-order"
                            className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Package className="w-4 h-4" />
                            <span>Track Orders</span>
                          </Link>
                        )}

                        {isAdmin && (
                          <>
                            <div className="border-t border-white/10 my-2"></div>
                            <Link
                              to="/admin"
                              className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Shield className="w-4 h-4" />
                              <span>Admin Panel</span>
                            </Link>
                          </>
                        )}

                        <div className="border-t border-white/10 my-2"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="flex items-center space-x-1 px-4 py-2 rounded-lg glass-card hover:bg-white/10 transition-colors text-white"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                  <Link to="/signup" className="catrink-button text-sm">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg glass-card"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-card border-t border-white/10"
            >
              <div className="px-4 py-6 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "block font-orbitron font-medium py-2 transition-all duration-300",
                      location.pathname === item.path
                        ? "text-neon-blue text-glow-blue"
                        : "text-white/80 hover:text-neon-purple",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-white/10">
                  {currentUser || isAdmin ? (
                    <div className="space-y-4">
                      {/* User Info */}
                      <div className="flex items-center justify-center">
                        <span className="text-white/70 text-sm">
                          Logged in as:{" "}
                          {isAdmin
                            ? "Admin"
                            : currentUser?.email?.split("@")[0]}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 px-4 py-3 rounded-lg glass-card hover:bg-white/10 transition-colors text-white text-sm"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>

                        <Link
                          to="/orders"
                          className="flex items-center space-x-2 px-4 py-3 rounded-lg glass-card hover:bg-white/10 transition-colors text-white text-sm relative"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FileText className="w-4 h-4" />
                          <span>Orders</span>
                          {orders.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-neon-red rounded-full text-xs flex items-center justify-center text-white font-bold">
                              {orders.length}
                            </span>
                          )}
                        </Link>
                      </div>

                      <div className="flex items-center justify-center space-x-3">
                        <button className="p-2 rounded-lg glass-card hover:bg-white/10 transition-colors">
                          <ShoppingCart className="w-5 h-5 text-white" />
                        </button>

                        {currentUser && hasEverOrdered && (
                          <Link
                            to="/track-order"
                            className="p-2 rounded-lg glass-card hover:bg-white/10 transition-colors relative"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Package className="w-5 h-5 text-neon-blue" />
                          </Link>
                        )}

                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="p-2 rounded-lg glass-card hover:bg-white/10 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Shield className="w-5 h-5 text-neon-cyan" />
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="p-2 rounded-lg glass-card hover:bg-white/10 transition-colors"
                        >
                          <LogOut className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <button className="p-2 rounded-lg glass-card hover:bg-white/10 transition-colors">
                          <ShoppingCart className="w-5 h-5 text-white" />
                        </button>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Link
                          to="/login"
                          className="px-4 py-2 rounded-lg glass-card hover:bg-white/10 transition-colors text-white text-sm text-center"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Login
                        </Link>
                        <Link
                          to="/signup"
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-semibold text-center"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="pt-16 md:pt-20">{children}</main>

      {/* Footer */}
      <footer className="glass-card border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue via-neon-purple to-neon-red flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-orbitron font-bold text-xl bg-gradient-to-r from-neon-blue via-neon-purple to-neon-red bg-clip-text text-transparent">
                  CATRINK
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Awaken the Cat reflex Inside you with our premium energy drinks.
                Fuel your inner feline with electrifying taste and unstoppable
                energy.
              </p>
            </div>

            <div>
              <h3 className="font-orbitron font-semibold text-white mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-white/60 hover:text-neon-blue transition-colors text-sm"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-orbitron font-semibold text-white mb-4">
                Support
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-neon-purple transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-neon-purple transition-colors"
                  >
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-neon-purple transition-colors"
                  >
                    Returns
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-neon-purple transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-orbitron font-semibold text-white mb-4">
                Connect
              </h3>
              <div className="flex space-x-4">
                <button className="w-10 h-10 rounded-lg glass-card hover:bg-white/10 transition-colors flex items-center justify-center">
                  <span className="text-white/60 hover:text-neon-blue transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </span>
                </button>
                <button className="w-10 h-10 rounded-lg glass-card hover:bg-white/10 transition-colors flex items-center justify-center">
                  <span className="text-white/60 hover:text-neon-purple transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                    </svg>
                  </span>
                </button>
                <button className="w-10 h-10 rounded-lg glass-card hover:bg-white/10 transition-colors flex items-center justify-center">
                  <span className="text-white/60 hover:text-neon-red transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-white/40 text-sm">
              © 2024 Catrink Energy. All rights reserved. Awaken the Cat reflex
              Inside you.
            </p>
          </div>
        </div>
      </footer>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={cancelLogout}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass-card p-8 max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-neon-red/20 to-neon-purple/40 border border-neon-red/30 flex items-center justify-center">
                <LogOut className="w-8 h-8 text-neon-red" />
              </div>

              <h3 className="font-orbitron font-bold text-2xl text-white mb-4">
                Logout Confirmation
              </h3>

              <p className="text-white/70 mb-8 leading-relaxed">
                Do you really want to logout? You'll need to sign in again to
                access your account and track your orders.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-6 py-3 rounded-lg font-orbitron font-semibold text-white border-2 border-white/20 hover:bg-white/10 transition-all duration-300"
                >
                  No, Stay
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-6 py-3 rounded-lg font-orbitron font-semibold text-white bg-gradient-to-r from-neon-red to-neon-purple hover:scale-105 transition-all duration-300"
                >
                  Yes, Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;

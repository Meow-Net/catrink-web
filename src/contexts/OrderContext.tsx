import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  trackingId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  orderDate: Date;
  estimatedDelivery: Date;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  couponApplied?: {
    code: string;
    discount: number;
  };
}

interface OrderContextType {
  orders: Order[];
  hasEverOrdered: boolean;
  addOrder: (order: Omit<Order, "id">) => string;
  getOrderByTrackingId: (trackingId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  generateTrackingId: () => string;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider = ({ children }: OrderProviderProps) => {
  const { currentUser, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [hasEverOrdered, setHasEverOrdered] = useState<boolean>(false);

  // Get user-specific storage key
  const getUserStorageKey = () => {
    const userEmail = currentUser?.email || (isAdmin ? "admin@catrink.in" : "");
    return userEmail ? `catrink_has_ever_ordered_${userEmail}` : null;
  };

  // Get orders storage key
  const getOrdersStorageKey = () => {
    const userEmail = currentUser?.email || (isAdmin ? "admin@catrink.in" : "");
    return userEmail ? `catrink_orders_${userEmail}` : null;
  };

  // Load orders and hasEverOrdered flag when user changes
  useEffect(() => {
    const storageKey = getUserStorageKey();
    const ordersKey = getOrdersStorageKey();

    if (storageKey) {
      const savedFlag = localStorage.getItem(storageKey);
      setHasEverOrdered(savedFlag === "true");
    } else {
      setHasEverOrdered(false);
    }

    if (ordersKey) {
      const savedOrders = localStorage.getItem(ordersKey);
      if (savedOrders) {
        try {
          const parsedOrders = JSON.parse(savedOrders);
          // Convert date strings back to Date objects
          const ordersWithDates = parsedOrders.map((order: any) => ({
            ...order,
            orderDate: new Date(order.orderDate),
            estimatedDelivery: new Date(order.estimatedDelivery),
          }));
          setOrders(ordersWithDates);
        } catch (error) {
          console.error("Error loading orders:", error);
          setOrders([]);
        }
      } else {
        setOrders([]);
      }
    } else {
      setOrders([]);
    }
  }, [currentUser, isAdmin]);

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    const ordersKey = getOrdersStorageKey();
    if (ordersKey && orders.length > 0) {
      localStorage.setItem(ordersKey, JSON.stringify(orders));
    }
  }, [orders, currentUser, isAdmin]);

  const generateTrackingId = (): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
    let result = "CAT-";
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const addOrder = (orderData: Omit<Order, "id">): string => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
    };
    setOrders((prev) => [newOrder, ...prev]);

    // Mark that user has ever ordered and persist to localStorage
    if (!hasEverOrdered) {
      setHasEverOrdered(true);
      const storageKey = getUserStorageKey();
      if (storageKey) {
        localStorage.setItem(storageKey, "true");
      }
    }

    return newOrder.trackingId;
  };

  const getOrderByTrackingId = (trackingId: string): Order | undefined => {
    return orders.find((order) => order.trackingId === trackingId);
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    );
  };

  const value: OrderContextType = {
    orders,
    hasEverOrdered,
    addOrder,
    getOrderByTrackingId,
    updateOrderStatus,
    generateTrackingId,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

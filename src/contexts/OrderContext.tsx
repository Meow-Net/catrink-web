import { createContext, useContext, useState, ReactNode } from "react";

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [hasEverOrdered, setHasEverOrdered] = useState<boolean>(() => {
    // Load from localStorage on initialization
    const savedFlag = localStorage.getItem("catrink_has_ever_ordered");
    return savedFlag === "true";
  });

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
      localStorage.setItem("catrink_has_ever_ordered", "true");
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

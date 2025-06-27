import { createContext, useContext, useState, ReactNode } from "react";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  flavor: string;
  energy: "Medium" | "High" | "Ultra";
  rating: number;
  reviews: number;
  category: string;
}

export interface Flavor {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  color: string;
  ingredients: string[];
  energyLevel: "Medium" | "High" | "Ultra";
  rating: number;
  reviews: number;
  price: number;
  featured?: boolean;
}

interface ProductContextType {
  products: Product[];
  flavors: Flavor[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Product) => void;
  deleteProduct: (id: string) => void;
  addFlavor: (flavor: Flavor) => void;
  updateFlavor: (id: string, flavor: Flavor) => void;
  deleteFlavor: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider = ({ children }: ProductProviderProps) => {
  // Only Mango Bluster as requested
  const [products, setProducts] = useState<Product[]>([
    {
      id: "mango-bluster",
      name: "Mango Bluster",
      price: 4.99,
      image: "🥭",
      description:
        "Tropical mango energy with a wild twist. Unleash your inner jungle cat with this exotic blend.",
      flavor: "Mango Tropical",
      energy: "High",
      rating: 4.8,
      reviews: 1247,
      category: "tropical",
    },
  ]);

  const [flavors, setFlavors] = useState<Flavor[]>([
    {
      id: "mango-bluster",
      name: "Mango Bluster",
      tagline: "Tropical Thunder Unleashed",
      description:
        "Experience the explosive taste of tropical mango combined with our signature energy blend. This exotic fusion awakens your primal instincts while delivering a smooth, refreshing taste that'll transport you to a jungle paradise. Perfect for those who want to channel their inner wild cat.",
      image: "🥭",
      color: "from-orange-400 via-yellow-500 to-red-500",
      ingredients: [
        "Natural Mango Extract",
        "Taurine",
        "B-Vitamins",
        "Natural Caffeine",
        "Ginseng Root",
        "Electrolytes",
      ],
      energyLevel: "High",
      rating: 4.8,
      reviews: 1247,
      price: 4.99,
      featured: true,
    },
  ]);

  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, { ...product, id: Date.now().toString() }]);
  };

  const updateProduct = (id: string, product: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...product, id } : p)),
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addFlavor = (flavor: Flavor) => {
    setFlavors((prev) => [...prev, { ...flavor, id: Date.now().toString() }]);
  };

  const updateFlavor = (id: string, flavor: Flavor) => {
    setFlavors((prev) =>
      prev.map((f) => (f.id === id ? { ...flavor, id } : f)),
    );
  };

  const deleteFlavor = (id: string) => {
    setFlavors((prev) => prev.filter((f) => f.id !== id));
  };

  const value: ProductContextType = {
    products,
    flavors,
    addProduct,
    updateProduct,
    deleteProduct,
    addFlavor,
    updateFlavor,
    deleteFlavor,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

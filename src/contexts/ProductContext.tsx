import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Omit<Product, "id">) => void;
  deleteProduct: (id: string) => void;
  addFlavor: (flavor: Omit<Flavor, "id">) => void;
  updateFlavor: (id: string, flavor: Omit<Flavor, "id">) => void;
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

const defaultProducts: Product[] = [
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
];

const defaultFlavors: Flavor[] = [
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
];

export const ProductProvider = ({ children }: ProductProviderProps) => {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [flavors, setFlavors] = useState<Flavor[]>(defaultFlavors);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem("catrink_products");
    const savedFlavors = localStorage.getItem("catrink_flavors");

    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error("Error loading products:", error);
      }
    }

    if (savedFlavors) {
      try {
        setFlavors(JSON.parse(savedFlavors));
      } catch (error) {
        console.error("Error loading flavors:", error);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("catrink_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("catrink_flavors", JSON.stringify(flavors));
  }, [flavors]);

  const addProduct = (productData: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: string, productData: Omit<Product, "id">) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...productData, id } : p)),
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setFlavors((prev) => prev.filter((f) => f.id !== id));
  };

  const addFlavor = (flavorData: Omit<Flavor, "id">) => {
    const newFlavor: Flavor = {
      ...flavorData,
      id: Date.now().toString(),
    };
    setFlavors((prev) => [...prev, newFlavor]);
  };

  const updateFlavor = (id: string, flavorData: Omit<Flavor, "id">) => {
    setFlavors((prev) =>
      prev.map((f) => (f.id === id ? { ...flavorData, id } : f)),
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

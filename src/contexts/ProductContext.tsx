import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/types";

// Mock product data with updated images
const mockProducts: Product[] = [
  {
    id: "product-1",
    title: "UI Templates Pack",
    description: "A collection of premium UI templates for modern web design projects. Includes landing pages, dashboards, and e-commerce components.",
    price: 49.99,
    category: "templates",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&auto=format&fit=crop&q=60",
    featured: true,
    tags: ["UI", "templates", "web design"]
  },
  {
    id: "product-2",
    title: "Digital Marketing Course",
    description: "Comprehensive digital marketing course covering SEO, social media marketing, content strategy, and paid advertising.",
    price: 79.99,
    category: "courses",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop&q=60",
    featured: true,
    tags: ["marketing", "course", "digital"]
  },
  {
    id: "product-3",
    title: "Stock Photo Bundle",
    description: "Collection of 500+ high-resolution stock photos for commercial use. Includes nature, business, and lifestyle categories.",
    price: 39.99,
    category: "assets",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60",
    featured: false,
    tags: ["photos", "stock", "assets"]
  },
  {
    id: "product-4",
    title: "Video Editing Toolkit",
    description: "Professional video editing toolkit with transitions, effects, and sound packs for content creators.",
    price: 59.99,
    category: "tools",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=60",
    featured: true,
    tags: ["video", "editing", "toolkit"]
  },
  {
    id: "product-5",
    title: "Icon Library Pro",
    description: "Professional icon library with 2000+ customizable vector icons in multiple formats and styles.",
    price: 29.99,
    category: "assets",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60",
    featured: false,
    tags: ["icons", "assets", "design"]
  },
  {
    id: "product-6",
    title: "Web Development Masterclass",
    description: "Complete web development course covering front-end, back-end, and database technologies with real-world projects.",
    price: 89.99,
    category: "courses",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60",
    featured: true,
    tags: ["web development", "course", "coding"]
  },
  {
    id: "product-7",
    title: "AI Design Tool",
    description: "Powerful AI-driven design tool that generates creative layouts and design concepts instantly.",
    price: 99.99,
    category: "tools",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=60",
    featured: true,
    tags: ["AI", "design", "tool"]
  },
  {
    id: "product-8",
    title: "Photography Masterclass",
    description: "Professional photography course covering techniques, post-processing, and advanced composition skills.",
    price: 69.99,
    category: "courses",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800&auto=format&fit=crop&q=60",
    featured: false,
    tags: ["photography", "course", "skills"]
  },
  {
    id: "product-9",
    title: "Digital Asset Pack",
    description: "Comprehensive collection of digital assets including graphics, templates, and design elements.",
    price: 44.99,
    category: "assets",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&auto=format&fit=crop&q=60",
    featured: true,
    tags: ["assets", "graphics", "design"]
  },
  {
    id: "product-10",
    title: "Productivity Toolkit",
    description: "A suite of productivity apps and tools to enhance workflow and time management.",
    price: 54.99,
    category: "tools",
    image: "https://images.unsplash.com/photo-1628260412295-a3f88db14c11?w=800&auto=format&fit=crop&q=60",
    featured: false,
    tags: ["productivity", "tools", "workflow"]
  }
];

export type ProductContextType = {
  products: Product[];
  featuredProducts: Product[];
  getProduct: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  searchProducts: (query: string, filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
  }) => Product[];
  categories: string[];
  tags: string[];
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const featuredProducts = products.filter((product) => product.featured);

  const getProduct = (id: string) => {
    return products.find((product) => product.id === id);
  };

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct = {
      ...product,
      id: `product-${Date.now()}`,
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, ...updatedFields } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const searchProducts = (
    query: string,
    filters?: {
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      tags?: string[];
    }
  ): Product[] => {
    return products.filter((product) => {
      // Search by query in title and description
      const matchesQuery =
        query === "" ||
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase());

      // Filter by category
      const matchesCategory = !filters?.category || product.category === filters.category;

      // Filter by price range
      const matchesMinPrice = !filters?.minPrice || product.price >= filters.minPrice;
      const matchesMaxPrice = !filters?.maxPrice || product.price <= filters.maxPrice;

      // Filter by tags
      const matchesTags =
        !filters?.tags?.length ||
        filters.tags.some((tag) => product.tags.includes(tag));

      return (
        matchesQuery &&
        matchesCategory &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesTags
      );
    });
  };

  // Get all unique categories
  const categories = Array.from(new Set(products.map((product) => product.category)));

  // Get all unique tags
  const tags = Array.from(
    new Set(products.flatMap((product) => product.tags))
  );

  const value = {
    products,
    featuredProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    categories,
    tags,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};

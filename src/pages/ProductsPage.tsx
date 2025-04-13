
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";
import { Product } from "@/types";
import ProductGrid from "@/components/products/ProductGrid";
import SearchFilters from "@/components/products/SearchFilters";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { products, categories, tags, searchProducts } = useProducts();

  // Apply search and filters
  const applyFilters = (
    query: string,
    filters?: {
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      tags?: string[];
    }
  ) => {
    setIsLoading(true);
    // Simulate loading delay for a better user experience
    setTimeout(() => {
      const results = searchProducts(query, filters);
      setFilteredProducts(results);
      setIsLoading(false);
    }, 500);
  };

  // Initialize products on component mount
  useEffect(() => {
    const query = searchParams.get("search") || "";
    const category = searchParams.get("category") || undefined;
    const tags = searchParams.get("tags")?.split(",").filter(Boolean);
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    
    setSearchQuery(query);
    applyFilters(query, {
      category,
      minPrice,
      maxPrice,
      tags: tags?.length ? tags : undefined,
    });
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update search param in URL
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
    
    // Apply search
    const category = searchParams.get("category") || undefined;
    const tags = searchParams.get("tags")?.split(",").filter(Boolean);
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    
    applyFilters(searchQuery, {
      category,
      minPrice,
      maxPrice,
      tags: tags?.length ? tags : undefined,
    });
  };

  const handleFilterChange = (filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
  }) => {
    applyFilters(searchQuery, filters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Products</h1>
      
      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-10 pr-16"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            type="submit" 
            className="absolute right-0 top-0 rounded-l-none bg-brand-blue hover:bg-brand-dark"
          >
            Search
          </Button>
        </div>
      </form>
      
      {/* Main content area with filters and products */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <SearchFilters 
            categories={categories} 
            tags={tags} 
            onFilter={handleFilterChange} 
          />
        </div>
        
        {/* Products grid */}
        <div className="flex-grow">
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
            </div>
          ) : (
            <>
              <div className="mb-4 text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </div>
              <ProductGrid 
                products={filteredProducts} 
                emptyMessage="No products match your search criteria. Try different filters or search terms."
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

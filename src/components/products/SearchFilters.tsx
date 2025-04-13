
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

interface SearchFiltersProps {
  categories: string[];
  tags: string[];
  onFilter: (filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
  }) => void;
}

const SearchFilters = ({ categories, tags, onFilter }: SearchFiltersProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    searchParams.get("category") || undefined
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get("category") || undefined;
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    
    setSelectedCategory(category);
    setSelectedTags(tags);
    if (minPrice !== undefined && maxPrice !== undefined) {
      setPriceRange([minPrice, maxPrice]);
    }
    
    // Apply filters on initial load
    onFilter({ category, minPrice, maxPrice, tags: tags.length ? tags : undefined });
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if (selectedCategory) {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }
    
    if (selectedTags.length) {
      params.set("tags", selectedTags.join(","));
    } else {
      params.delete("tags");
    }
    
    if (priceRange[0] > 0) {
      params.set("minPrice", priceRange[0].toString());
    } else {
      params.delete("minPrice");
    }
    
    if (priceRange[1] < 100) {
      params.set("maxPrice", priceRange[1].toString());
    } else {
      params.delete("maxPrice");
    }
    
    setSearchParams(params);
    
    // Apply filters
    onFilter({
      category: selectedCategory,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 100 ? priceRange[1] : undefined,
      tags: selectedTags.length ? selectedTags : undefined,
    });
  }, [selectedCategory, selectedTags, priceRange]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(selectedCategory === category ? undefined : category);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const clearFilters = () => {
    setSelectedCategory(undefined);
    setSelectedTags([]);
    setPriceRange([0, 100]);
  };

  const hasActiveFilters = selectedCategory || selectedTags.length > 0 || priceRange[0] > 0 || priceRange[1] < 100;

  return (
    <div className="p-4 border rounded-lg bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Filters</h3>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            <XCircle size={16} className="mr-1" /> Clear all
          </Button>
        )}
      </div>

      <Accordion type="single" collapsible defaultValue="category">
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category}`} 
                    checked={selectedCategory === category}
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
                  <label 
                    htmlFor={`category-${category}`}
                    className="text-sm font-medium capitalize cursor-pointer"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="px-1">
              <Slider 
                defaultValue={[0, 100]} 
                value={priceRange}
                min={0} 
                max={100} 
                step={1} 
                onValueChange={handlePriceChange}
              />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tags">
          <AccordionTrigger>Tags</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {tags.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`tag-${tag}`}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => handleTagToggle(tag)}
                  />
                  <label 
                    htmlFor={`tag-${tag}`}
                    className="text-sm font-medium capitalize cursor-pointer"
                  >
                    {tag}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SearchFilters;

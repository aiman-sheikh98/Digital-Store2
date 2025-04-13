
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/types";
import { useProducts } from "@/contexts/ProductContext";

interface AdminProductFormProps {
  product: Product | null;
  onSubmit: (data: Omit<Product, "id">) => void;
  onCancel: () => void;
}

const AdminProductForm = ({ product, onSubmit, onCancel }: AdminProductFormProps) => {
  const { categories } = useProducts();
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    title: "",
    description: "",
    price: 0,
    category: "",
    image: "",
    featured: false,
    tags: []
  });
  
  const [tagsInput, setTagsInput] = useState("");
  
  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setFormData({ ...product });
      setTagsInput(product.tags.join(", "));
    } else {
      resetForm();
    }
  }, [product]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: 0,
      category: "",
      image: "",
      featured: false,
      tags: []
    });
    setTagsInput("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagsInput(value);
    
    // Convert comma-separated tags to array
    const tagsArray = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
      
    setFormData((prev) => ({
      ...prev,
      tags: tagsArray
    }));
  };

  const handleFeaturedChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      featured: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    
    if (!product) {
      resetForm(); // Only reset if adding a new product
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Product Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
            <option value="new-category">+ Add new category</option>
          </select>
        </div>
      </div>
      
      {formData.category === "new-category" && (
        <div>
          <Label htmlFor="newCategory">New Category</Label>
          <Input
            id="newCategory"
            name="category"
            value={formData.category === "new-category" ? "" : formData.category}
            onChange={handleChange}
            required
          />
        </div>
      )}
      
      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          name="tags"
          value={tagsInput}
          onChange={handleTagsChange}
          placeholder="e.g. template, design, web"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="featured" 
          checked={formData.featured}
          onCheckedChange={handleFeaturedChange}
        />
        <label
          htmlFor="featured"
          className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Featured product
        </label>
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="bg-brand-blue hover:bg-brand-dark">
          {product ? "Update Product" : "Add Product"}
        </Button>
        {product && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default AdminProductForm;

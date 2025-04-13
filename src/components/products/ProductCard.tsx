
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  return (
    <Card className="product-card overflow-hidden h-full flex flex-col">
      <Link to={`/products/${product.id}`} className="block overflow-hidden">
        <div className="h-48 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="pt-4 flex-grow">
        <div className="flex justify-between items-start">
          <Link to={`/products/${product.id}`} className="block">
            <h3 className="font-semibold text-lg hover:text-brand-blue transition-colors">
              {product.title}
            </h3>
          </Link>
          {product.featured && (
            <Badge variant="secondary" className="bg-brand-blue/10 text-brand-blue">
              Featured
            </Badge>
          )}
        </div>
        
        <div className="mt-2">
          <Badge variant="outline" className="mr-1">
            {product.category}
          </Badge>
        </div>
        
        <p className="text-gray-600 mt-2 text-sm line-clamp-2">
          {product.description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 flex items-center justify-between">
        <div className="text-lg font-semibold">${product.price.toFixed(2)}</div>
        <Button 
          size="sm" 
          onClick={() => addToCart(product)}
          className="bg-brand-blue hover:bg-brand-dark"
        >
          <ShoppingCart size={16} className="mr-2" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;


import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ShoppingCart, ArrowLeft, Plus, Minus } from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";
import { useCart } from "@/contexts/CartContext";
import { useNotifications } from "@/contexts/NotificationContext";

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getProduct } = useProducts();
  const { addToCart } = useCart();
  const { pushNotification } = useNotifications();
  const [quantity, setQuantity] = useState(1);
  
  const product = getProduct(id || "");

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/products">
            <ArrowLeft size={16} className="mr-2" /> Back to Products
          </Link>
        </Button>
      </div>
    );
  }

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    pushNotification({
      title: "Added to cart",
      message: `${product.title} has been added to your cart.`,
      type: "success",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center mb-6 text-gray-600 hover:text-brand-blue">
        <ArrowLeft size={16} className="mr-2" /> Back to Products
      </Link>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product image */}
        <div>
          <div className="bg-gray-100 rounded-lg overflow-hidden h-96">
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Product details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="capitalize">
              {product.category}
            </Badge>
            {product.featured && (
              <Badge variant="secondary" className="bg-brand-blue/10 text-brand-blue">
                Featured
              </Badge>
            )}
          </div>
          
          <div className="text-2xl font-semibold mb-4 text-brand-blue">
            ${product.price.toFixed(2)}
          </div>
          
          <p className="text-gray-700 mb-6">
            {product.description}
          </p>
          
          {/* Tags */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="capitalize">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Quantity</h3>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={decrementQuantity} 
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </Button>
              <span className="mx-4 w-8 text-center">{quantity}</span>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={incrementQuantity}
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>
          
          <Button 
            onClick={handleAddToCart}
            size="lg" 
            className="w-full bg-brand-blue hover:bg-brand-dark"
          >
            <ShoppingCart size={18} className="mr-2" /> Add to Cart
          </Button>
        </div>
      </div>

      {/* Related information section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Product Details</h2>
        <Card className="p-6">
          <div className="prose max-w-none">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisis, nunc vel fermentum volutpat, sapien nisl varius nibh, non scelerisque arcu augue vel tellus. Proin ut placerat orci. In hac habitasse platea dictumst. Sed venenatis tellus libero, et consequat nulla dignissim ut.
            </p>
            <h3>What's Included</h3>
            <ul>
              <li>Full access to the digital product</li>
              <li>Lifetime updates</li>
              <li>Email support for 6 months</li>
              <li>Detailed documentation</li>
            </ul>
            <h3>System Requirements</h3>
            <p>
              This digital product is compatible with all modern operating systems and devices.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

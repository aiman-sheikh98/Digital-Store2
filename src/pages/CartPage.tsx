
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const { isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState("");
  
  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, we would validate the coupon here
    alert(`Coupon ${couponCode} applied!`);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex flex-col items-center justify-center">
          <ShoppingCart size={64} className="text-gray-300 mb-4" />
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Button asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="hidden md:grid grid-cols-8 gap-4 mb-4 font-medium text-gray-500">
              <div className="col-span-3">Product</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-1">Total</div>
            </div>
            
            <Separator className="mb-6" />
            
            {cartItems.map((item) => (
              <div key={item.product.id}>
                <div className="grid grid-cols-1 md:grid-cols-8 gap-4 py-4 items-center">
                  {/* Product info */}
                  <div className="col-span-3">
                    <div className="flex items-center">
                      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={item.product.image} 
                          alt={item.product.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium">{item.product.title}</h3>
                        <p className="text-sm text-gray-500 md:hidden">
                          ${item.product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="hidden md:block col-span-2">
                    ${item.product.price.toFixed(2)}
                  </div>
                  
                  {/* Quantity */}
                  <div className="col-span-2">
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)} 
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </Button>
                      <span className="mx-3 w-6 text-center">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Total */}
                  <div className="col-span-1 flex items-center justify-between">
                    <span className="text-brand-blue font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeFromCart(item.product.id)} 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
                <Separator />
              </div>
            ))}
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
              <Link to="/products">
                <Button variant="link" className="flex items-center">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Cart summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {/* Coupon */}
            <form onSubmit={handleCouponSubmit} className="mb-6">
              <div className="flex mb-4">
                <Input 
                  placeholder="Coupon code" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="rounded-r-none"
                />
                <Button type="submit" className="rounded-l-none">
                  Apply
                </Button>
              </div>
            </form>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between font-semibold text-lg mb-6">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <Button 
              asChild
              className="w-full bg-brand-blue hover:bg-brand-dark"
            >
              <Link to={isAuthenticated ? "/checkout" : "/login?redirect=/checkout"}>
                Proceed to Checkout <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

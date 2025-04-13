
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import RazorpayCheckout from "@/components/checkout/RazorpayCheckout";
import { useNotifications } from "@/contexts/NotificationContext";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { pushNotification } = useNotifications();
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const handleShippingInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSuccess = (paymentId: string) => {
    // In a real application, this would create an order in the database
    clearCart();
    
    // Navigate to success page
    navigate("/checkout/success", { 
      state: { 
        orderId: `ORD-${Math.floor(Math.random() * 100000)}`,
        paymentId
      } 
    });
  };

  const handleTestCheckout = () => {
    // Simulate successful payment
    pushNotification({
      title: "Test payment successful",
      message: "This is a test payment. In a real application, you would be redirected to the payment gateway.",
      type: "info"
    });
    
    handleCheckoutSuccess(`TEST-${Math.floor(Math.random() * 100000)}`);
  };

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Shipping and Payment */}
        <div className="md:col-span-2">
          <Tabs defaultValue="shipping">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
            </TabsList>
            
            {/* Shipping tab */}
            <TabsContent value="shipping">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={handleShippingInput}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={handleShippingInput}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={handleShippingInput}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingInput}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingInput}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingInput}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingInput}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingInput}
                      required
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      type="button" 
                      onClick={() => {
                        // Simulate form validation
                        // In a real application, validate the form
                        const paymentTab = document.querySelector('[data-value="payment"]') as HTMLElement;
                        if (paymentTab) {
                          paymentTab.click();
                        }
                      }}
                      className="w-full bg-brand-blue hover:bg-brand-dark"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              </Card>
            </TabsContent>
            
            {/* Payment tab */}
            <TabsContent value="payment">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="space-y-6">
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-14 bg-gray-200 rounded flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="5" width="20" height="14" rx="2" />
                          <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                      </div>
                      <div className="text-lg font-medium">Pay with Razorpay</div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      You will be redirected to Razorpay's secure payment page to complete your purchase.
                    </p>
                    <RazorpayCheckout total={subtotal} onSuccess={handleCheckoutSuccess} />
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-14 bg-gray-200 rounded flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="16" />
                          <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                      </div>
                      <div className="text-lg font-medium">Test Payment (Demo Only)</div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      This is a test payment option for demonstration purposes only.
                    </p>
                    <Button 
                      onClick={handleTestCheckout} 
                      variant="outline"
                      className="w-full"
                    >
                      Complete Test Payment
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Order summary */}
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-4">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0 mr-3">
                      <img 
                        src={item.product.image} 
                        alt={item.product.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.product.title}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

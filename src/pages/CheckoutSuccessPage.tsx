
import { useLocation, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const CheckoutSuccessPage = () => {
  const location = useLocation();
  const { orderId, paymentId } = location.state || {};
  
  // Redirect to home if no order data is present
  if (!orderId) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 size={40} className="text-green-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been placed and is being processed.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment ID:</span>
              <span className="font-medium">{paymentId}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mb-6">
            A confirmation email has been sent to your registered email address.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <Button asChild variant="outline">
              <Link to="/orders">View Orders</Link>
            </Button>
            <Button asChild>
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;

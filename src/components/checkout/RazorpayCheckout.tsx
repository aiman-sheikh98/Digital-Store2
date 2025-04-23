
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

interface RazorpayCheckoutProps {
  total: number;
  onSuccess: (paymentId: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript = () => {
  return new Promise<void>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
};

const RazorpayCheckout = ({ total, onSuccess }: RazorpayCheckoutProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { clearCart } = useCart();
  const { pushNotification } = useNotifications();

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      // Load Razorpay script if not loaded already
      if (!window.Razorpay) {
        await loadRazorpayScript();
      }

      // In a real implementation, this would call your backend API to create an order
      // Here we're simulating the API response with a Promise
      const orderData = await createOrder(total);

      // Create order options
      const options = {
        key: "rzp_test_YourTestKey", // Replace with your Razorpay test key
        amount: total * 100, // Amount in smallest currency unit (paise for INR)
        currency: "INR",
        name: "DigitalStore",
        description: "Purchase of digital products",
        order_id: orderData.id, // This would come from your backend in a real implementation
        image: "https://i.imgur.com/QdR9ysT.png", 
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#2563eb",
        },
        handler: function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
          // In a real implementation, you would verify this payment on your backend
          verifyPayment(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature)
            .then(() => {
              // Handle payment success
              onSuccess(response.razorpay_payment_id);
              clearCart();

              // Show success toast and notification
              toast({
                title: "Payment successful!",
                description: `Your payment was processed successfully. Order ID: ${response.razorpay_order_id}`,
              });

              pushNotification({
                title: "Payment successful",
                message: `Your order has been placed and payment processed. Order ID: ${response.razorpay_order_id.substring(0, 8)}...`,
                type: "success",
              });
            })
            .catch(error => {
              console.error("Payment verification failed:", error);
              toast({
                title: "Payment verification failed",
                description: "There was an error verifying your payment. Please contact support.",
                variant: "destructive",
              });
            })
            .finally(() => {
              setIsLoading(false);
            });
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            toast({
              title: "Payment cancelled",
              description: "You have cancelled the payment process.",
              variant: "destructive",
            });
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      toast({
        title: "Payment error",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Simulated API call to create an order - in a real implementation, this would be a fetch to your backend
  const createOrder = async (amount: number): Promise<{ id: string }> => {
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: `order_${Date.now()}` });
      }, 500);
    });
  };

  // Simulated API call to verify payment - in a real implementation, this would be a fetch to your backend
  const verifyPayment = async (paymentId: string, orderId: string, signature: string): Promise<boolean> => {
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={isLoading} 
      className="w-full bg-brand-blue hover:bg-brand-dark"
    >
      {isLoading ? "Processing..." : "Pay Now"}
    </Button>
  );
};

export default RazorpayCheckout;

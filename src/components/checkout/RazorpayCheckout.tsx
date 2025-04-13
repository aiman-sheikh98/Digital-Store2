
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

      // Create order options
      // In a real implementation, you would call your backend to create an order
      const options = {
        key: "rzp_test_YourTestKey", // Replace with your Razorpay test key
        amount: total * 100, // Amount in paise
        currency: "INR",
        name: "DigitalStore",
        description: "Purchase of digital products",
        image: "https://i.imgur.com/QdR9ysT.png", 
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#2563eb",
        },
        handler: function (response: { razorpay_payment_id: string }) {
          // Handle payment success
          const paymentId = response.razorpay_payment_id;
          onSuccess(paymentId);
          clearCart();

          // Show success toast and notification
          toast({
            title: "Payment successful!",
            description: `Your payment was processed successfully. Order ID: ${paymentId}`,
          });

          pushNotification({
            title: "Payment successful",
            message: `Your order has been placed and payment processed. Order ID: ${paymentId.substring(0, 8)}...`,
            type: "success",
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
    } finally {
      setIsLoading(false);
    }
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

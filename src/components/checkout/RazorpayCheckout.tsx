
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
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector("script[src='https://checkout.razorpay.com/v1/checkout.js']")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject("Failed to load Razorpay SDK");
    document.body.appendChild(script);
  });
};

const RazorpayCheckout = ({ total, onSuccess }: RazorpayCheckoutProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { clearCart, cartItems } = useCart();
  const { pushNotification } = useNotifications();

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // 1. Load Razorpay SDK if needed.
      if (!window.Razorpay) {
        await loadRazorpayScript();
      }

      // 2. Call backend API to create the real order
      const orderRes = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: total * 100, // INR - in paise
          currency: "INR",
          // Optional: pass order/cart details
          user: {
            name: user?.name || "",
            email: user?.email || "",
            id: user?.id || "",
          },
          cart: cartItems.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          }))
        }),
      });
      if (!orderRes.ok) throw new Error("Failed to create order");
      const orderData = await orderRes.json();

      // 3. Prepare Razorpay options using backend order response
      const options = {
        key: orderData.key_id, // Your public key from backend for extra security
        amount: orderData.amount, // should come from backend (paise)
        currency: orderData.currency,
        name: "DigitalStore",
        description: "Purchase of digital products",
        image: "https://i.imgur.com/QdR9ysT.png",
        order_id: orderData.id,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#2563eb",
        },
        handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
          // 4. Verify signature with backend
          const verifyRes = await fetch("/api/verify-razorpay-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              // Optionally send user, cart details
            }),
          });
          if (verifyRes.ok) {
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
          } else {
            toast({
              title: "Payment verification failed",
              description: "There was an error verifying your payment. Please contact support.",
              variant: "destructive",
            });
          }
          setIsLoading(false);
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

      // 5. Open the Razorpay payment modal
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

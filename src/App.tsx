
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ProductProvider } from "./contexts/ProductContext";
import { NotificationProvider } from "./contexts/NotificationContext";

// Pages
import Home from "./pages/Home";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <NotificationProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<MainLayout><Home /></MainLayout>} />
                  <Route path="/products" element={<MainLayout><ProductsPage /></MainLayout>} />
                  <Route path="/products/:id" element={<MainLayout><ProductDetailsPage /></MainLayout>} />
                  <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
                  <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
                  <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />
                  
                  {/* Protected routes */}
                  <Route path="/account" element={<MainLayout><AccountPage /></MainLayout>} />
                  <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
                  <Route path="/checkout/success" element={<MainLayout><CheckoutSuccessPage /></MainLayout>} />
                  <Route path="/admin" element={<MainLayout><AdminDashboard /></MainLayout>} />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </NotificationProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

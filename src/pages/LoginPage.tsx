
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { pushNotification } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  // Get redirect path from query string (if any)
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      
      pushNotification({
        title: "Login successful",
        message: "Welcome back to DigitalStore!",
        type: "success"
      });
      
      // Redirect after successful login
      navigate(redirectPath);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Sign In</h1>
            <p className="text-gray-600">
              Welcome back! Please sign in to access your account
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-brand-blue hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-brand-blue hover:bg-brand-dark"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6">
            <p className="text-center text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-brand-blue hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
          
          <div className="mt-8">
            <div className="mb-4 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">Demo Accounts</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setEmail("admin@digitalstore.com");
                  setPassword("admin123");
                }}
              >
                Admin User
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEmail("user@digitalstore.com");
                  setPassword("user123");
                }}
              >
                Regular User
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;

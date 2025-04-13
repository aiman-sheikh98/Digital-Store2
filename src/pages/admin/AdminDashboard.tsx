
import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Product } from "@/types";
import AdminProductList from "./AdminProductList";
import AdminProductForm from "./AdminProductForm";

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { pushNotification } = useNotifications();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    featuredProducts: 0,
    categories: 0,
  });

  // Only admin users can access this page
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // Update stats whenever products change
  useEffect(() => {
    setStats({
      totalProducts: products.length,
      featuredProducts: products.filter(p => p.featured).length,
      categories: new Set(products.map(p => p.category)).size,
    });
  }, [products]);

  const handleAddProduct = (product: Omit<Product, "id">) => {
    addProduct(product);
    pushNotification({
      title: "Product added",
      message: `${product.title} has been added successfully.`,
      type: "success",
    });
  };

  const handleEditProduct = (id: string, product: Partial<Product>) => {
    updateProduct(id, product);
    setSelectedProduct(null);
    pushNotification({
      title: "Product updated",
      message: `${product.title || 'Product'} has been updated successfully.`,
      type: "success",
    });
  };

  const handleDeleteProduct = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteProduct(id);
      pushNotification({
        title: "Product deleted",
        message: `${title} has been deleted.`,
        type: "success",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link to="/">
          <Button variant="outline">View Store</Button>
        </Link>
      </div>
      
      {/* Stats cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-gray-500 text-sm">Total Products</h3>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-gray-500 text-sm">Featured Products</h3>
          <p className="text-3xl font-bold">{stats.featuredProducts}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-gray-500 text-sm">Categories</h3>
          <p className="text-3xl font-bold">{stats.categories}</p>
        </Card>
      </div>
      
      <Tabs defaultValue="products">
        <TabsList className="mb-6">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-2">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {selectedProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <AdminProductForm 
                  product={selectedProduct}
                  onSubmit={selectedProduct ? 
                    (data) => handleEditProduct(selectedProduct.id, data) : 
                    handleAddProduct as any
                  }
                  onCancel={() => setSelectedProduct(null)}
                />
              </Card>
            </div>
            
            <div className="md:col-span-3">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Product List</h2>
                <AdminProductList 
                  products={products}
                  onEdit={setSelectedProduct}
                  onDelete={handleDeleteProduct}
                />
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Orders</h2>
            <p className="text-gray-500">
              Order management functionality would be implemented here.
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Users</h2>
            <p className="text-gray-500">
              User management functionality would be implemented here.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

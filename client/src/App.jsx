import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useEffect, useState } from "react";

import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import StockIn from "./pages/StockIn";
import StockOut from "./pages/StockOut";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Layout from "./Layout";

import "./App.css";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

// Get products from MongoDB
useEffect(() => {
  fetch("https://inventory-management-system-1-5pa5.onrender.com/api/products")
    .then((response) => response.json())
    .then((data) => {
      setProducts(data);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      setLoading(false);
    });
}, []);

// Get transactions from MongoDB
useEffect(() => {
  fetch("https://inventory-management-system-1-5pa5.onrender.com/api/transactions")
    .then((response) => response.json())
    .then((data) => {
      setTransactions(data);
    })
    .catch((error) => {
      console.error("Error fetching transactions:", error);
    });
}, []);

  // Statistics
  const totalProducts = products.length;

  const totalStockIn = transactions
    .filter((transaction) => transaction.type === "Stock In")
    .reduce((total, transaction) => total + transaction.quantity, 0);

  const totalStockOut = transactions
    .filter((transaction) => transaction.type === "Stock Out")
    .reduce((total, transaction) => total + transaction.quantity, 0);

  const lowStockProducts = products.filter(
    (product) => product.quantity <= 5
  ).length;

  // Recent Products
  const recentProducts = products.slice(-3).reverse();

  return (
    <>
      {/* Topbar */}
      <header className="topbar">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to Inventory Management System</p>
        </div>

        <div className="admin">
          <div className="admin-icon">A</div>

          <div>
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>
        </div>
      </header>

      {/* Statistics */}
      <section className="stats">
        <div className="card">
          <div className="card-icon">📦</div>

          <div>
            <p>Total Products</p>
            <h2>{loading ? "..." : totalProducts}</h2>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">📥</div>

          <div>
            <p>Stock In</p>
            <h2>{totalStockIn}</h2>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">📤</div>

          <div>
            <p>Stock Out</p>
            <h2>{totalStockOut}</h2>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">⚠️</div>

          <div>
            <p>Low Stock</p>
            <h2>{loading ? "..." : lowStockProducts}</h2>
          </div>
        </div>
      </section>

      {/* Recent Products */}
      <section className="products-section">
        <div className="section-header">
          <div>
            <h2>Recent Products</h2>
            <p>Your latest inventory products</p>
          </div>

          <a href="/add-product" className="add-button">
            + Add Product
          </a>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>Loading products...</h3>
          </div>
        ) : recentProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>

            <h3>No products available</h3>

            <p>
              Add your first product to start managing inventory.
            </p>

            <a href="/add-product" className="add-button">
              Add Product
            </a>
          </div>
        ) : (
          <div className="recent-products-list">
            {recentProducts.map((product) => (
              <div
                className="recent-product-card"
                key={product._id}
              >
                <div className="product-card-icon">
                  📦
                </div>

                <div className="product-card-info">
                  <h3>{product.productName}</h3>

                  <p>
                    {product.productId} • {product.category}
                  </p>

                  <div className="product-price">
                    ₹{product.price}
                  </div>
                </div>

                <div
                  className={
                    product.quantity <= 5
                      ? "product-stock low"
                      : "product-stock"
                  }
                >
                  <strong>{product.quantity}</strong>
                  <span> units</span>

                  {product.quantity <= 5 && (
                    <small>⚠️ Low Stock</small>
                  )}
                </div>
              </div>
            ))}

            <div className="view-all-container">
              <a
                href="/products"
                className="view-all-button"
              >
                View All Products →
              </a>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn !== "true") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Protected Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/stock-in" element={<StockIn />} />
          <Route path="/stock-out" element={<StockOut />} />
          <Route path="/reports" element={<Reports />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
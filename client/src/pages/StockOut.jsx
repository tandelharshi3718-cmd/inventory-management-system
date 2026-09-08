import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StockOut.css";

function StockOut() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "https://inventory-management-system-1-5pa5.onrender.com";

  // GET PRODUCTS FOR LOGGED-IN USER
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API_URL}/api/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [navigate]);

  // STOCK OUT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct) {
      alert("Please select a product");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    if (!date) {
      alert("Please select a date");
      return;
    }

    if (!reason) {
      alert("Please select a reason");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/products/${selectedProduct}/stock-out`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity: Number(quantity),
            date: date,
            reason: reason,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Stock removed successfully!");

        setSelectedProduct("");
        setQuantity("");
        setDate("");
        setReason("");

        navigate("/products");
      } else {
        alert(data.message || "Failed to remove stock");
      }
    } catch (error) {
      console.error("Error removing stock:", error);
      alert("Server se connection nahi ho raha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stock-out-page">
      <div className="stock-out-header">
        <h1>Stock Out</h1>
        <p>Remove outgoing stock from your inventory</p>
      </div>

      <div className="stock-out-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product</label>

            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              required
            >
              <option value="">Select Product</option>

              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.productName} ({product.productId}) - Stock:{" "}
                  {product.quantity}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Quantity</label>

            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Reason</label>

            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="">Select Reason</option>
              <option value="Sale">Sale</option>
              <option value="Damaged">Damaged</option>
              <option value="Returned">Returned</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/products")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="stock-out-btn"
              disabled={loading}
            >
              {loading ? "Removing..." : "Remove Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StockOut;
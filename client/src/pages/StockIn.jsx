import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StockIn.css";

function StockIn() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");

  // GET PRODUCTS
  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // ADD STOCK
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

    try {
      const response = await fetch(
        `http://localhost:3000/api/products/${selectedProduct}/stock-in`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: Number(quantity),
            date: date,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Stock added successfully!");

        setSelectedProduct("");
        setQuantity("");
        setDate("");

        navigate("/products");
      } else {
        alert(data.message || "Failed to add stock");
      }
    } catch (error) {
      console.error("Error adding stock:", error);
      alert("Server se connection nahi ho raha.");
    }
  };

  return (
    <div className="stock-in-page">
      <div className="stock-in-header">
        <h1>Stock In</h1>
        <p>Add incoming stock to your inventory</p>
      </div>

      <div className="stock-in-card">
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
                  {product.productName} ({product.productId})
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

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>

            <button type="submit" className="stock-in-btn">
              Add Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StockIn;
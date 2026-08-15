import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    productId: "",
    productName: "",
    category: "",
    quantity: "",
    price: "",
  });

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.productId,
          productName: product.productName,
          category: product.category,
          quantity: Number(product.quantity),
          price: Number(product.price),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Product added successfully!");

        navigate("/products");
      } else {
        alert(data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server se connection nahi ho raha.");
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-header">
        <h1>Add Product</h1>
        <p>Add a new product to your inventory</p>
      </div>

      <div className="product-form-card">
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Product ID</label>
            <input
              type="text"
              name="productId"
              value={product.productId}
              onChange={handleChange}
              placeholder="Enter product ID"
              required
            />
          </div>

          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="productName"
              value={product.productName}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              placeholder="Enter category"
              required
            />
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              required
            />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Enter price"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/products")}
            >
              Cancel
            </button>

            <button type="submit" className="save-btn">
              Add Product
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddProduct;
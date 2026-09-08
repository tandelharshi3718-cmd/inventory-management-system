import { useState, useEffect } from "react";
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
    supplierId: "",
  });
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "https://inventory-management-system-1-5pa5.onrender.com/api/suppliers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setSuppliers(data);
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://inventory-management-system-1-5pa5.onrender.com/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },

          body: JSON.stringify({
            productId: product.productId,
            productName: product.productName,
            category: product.category,
            quantity: Number(product.quantity),
            price: Number(product.price),
            supplierId: product.supplierId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Product added successfully!");

        setProduct({
          productId: "",
          productName: "",
          category: "",
          quantity: "",
          price: "",
        });

        navigate("/products");
      } else {
        alert(
          `${data.message || "Failed to add product"}\n${data.error || "No detailed error"
          }`
        );

        console.error("Backend error:", data);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Server se connection nahi ho raha.");
    } finally {
      setLoading(false);
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
            <label>Supplier</label>

            <select
              name="supplierId"
              value={product.supplierId}
              onChange={handleChange}
            >
              <option value="">Select Supplier</option>

              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.supplierName} - {supplier.companyName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              min="0"
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
              min="0"
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

            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
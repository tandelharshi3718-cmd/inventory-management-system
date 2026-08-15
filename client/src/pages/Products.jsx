import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingProduct, setEditingProduct] = useState(null);

  // SEARCH
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = () => {
    fetch("http://localhost:3000/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // SEARCH FILTER
  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();

    return (
      product.productId?.toLowerCase().includes(search) ||
      product.productName?.toLowerCase().includes(search) ||
      product.category?.toLowerCase().includes(search)
    );
  });

  // DELETE PRODUCT
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Product deleted successfully!");
        fetchProducts();
      } else {
        alert(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Server se connection nahi ho raha.");
    }
  };

  // EDIT BUTTON
  const handleEdit = (product) => {
    setEditingProduct({ ...product });
  };

  // UPDATE PRODUCT
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/api/products/${editingProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: editingProduct.productId,
            productName: editingProduct.productName,
            category: editingProduct.category,
            quantity: Number(editingProduct.quantity),
            price: Number(editingProduct.price),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Product updated successfully!");

        setEditingProduct(null);

        fetchProducts();
      } else {
        alert(data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Server se connection nahi ho raha.");
    }
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <div>
          <h1>Products</h1>
          <p>Manage your inventory products</p>
        </div>

        <button
          className="add-product-btn"
          onClick={() => navigate("/add-product")}
        >
          + Add Product
        </button>
      </div>

      {/* SEARCH BOX */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="products-table-container">
        {loading ? (
          <p>Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>{product.productId}</td>

                  <td>{product.productName}</td>

                  <td>{product.category}</td>

                  <td className={product.quantity <= 5 ? "low-stock" : ""}>
                    {product.quantity}

                    {product.quantity <= 5 && (
                      <span className="low-stock-text"> ⚠️ Low Stock</span>
                    )}
                  </td>

                  <td>₹{product.price}</td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* EDIT FORM */}
      {editingProduct && (
        <div className="edit-form-container">
          <div className="edit-form-card">
            <h2>Edit Product</h2>

            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Product ID</label>

                <input
                  type="text"
                  value={editingProduct.productId}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      productId: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Product Name</label>

                <input
                  type="text"
                  value={editingProduct.productName}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      productName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Category</label>

                <input
                  type="text"
                  value={editingProduct.category}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      category: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Quantity</label>

                <input
                  type="number"
                  value={editingProduct.quantity}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      quantity: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Price</label>

                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>

                <button type="submit" className="update-btn">
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
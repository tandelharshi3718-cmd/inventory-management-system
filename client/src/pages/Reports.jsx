import { useEffect, useState } from "react";
import "./Reports.css";

function Reports() {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get products and transactions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch(
          "https://inventory-management-system-1-5pa5.onrender.com/api/products"
        );

        const transactionsResponse = await fetch(
          "https://inventory-management-system-1-5pa5.onrender.com/api/transactions"
        );
        const productsData = await productsResponse.json();
        const transactionsData = await transactionsResponse.json();

        setProducts(productsData);
        setTransactions(transactionsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching report data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Total Products
  const totalProducts = products.length;

  // Total Stock In
  const totalStockIn = transactions
    .filter((transaction) => transaction.type === "Stock In")
    .reduce((total, transaction) => total + transaction.quantity, 0);

  // Total Stock Out
  const totalStockOut = transactions
    .filter((transaction) => transaction.type === "Stock Out")
    .reduce((total, transaction) => total + transaction.quantity, 0);

  // Low Stock
  const lowStock = products.filter(
    (product) => product.quantity <= 5
  ).length;

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Reports</h1>
          <p>View inventory reports and stock information</p>
        </div>
      </div>

      {/* Report Cards */}
      <div className="report-cards">
        <div className="report-card">
          <span>Total Products</span>
          <h2>{loading ? "..." : totalProducts}</h2>
        </div>

        <div className="report-card">
          <span>Total Stock In</span>
          <h2>{loading ? "..." : totalStockIn}</h2>
        </div>

        <div className="report-card">
          <span>Total Stock Out</span>
          <h2>{loading ? "..." : totalStockOut}</h2>
        </div>

        <div className="report-card">
          <span>Low Stock</span>
          <h2>{loading ? "..." : lowStock}</h2>
        </div>
      </div>

      {/* Inventory Summary */}
      <div className="report-table-card">
        <h2>Inventory Summary</h2>

        {loading ? (
          <p>Loading inventory data...</p>
        ) : products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.productId}</td>
                  <td>{product.productName}</td>
                  <td>{product.category}</td>
                  <td>{product.quantity}</td>
                  <td>₹{product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Transaction History */}
      <div className="report-table-card">
        <h2>Transaction History</h2>

        {loading ? (
          <p>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p>No transactions available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Reason</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>

                  <td>
                    {transaction.productId
                      ? transaction.productId.productName
                      : "Unknown Product"}
                  </td>

                  <td>{transaction.type}</td>

                  <td>{transaction.quantity}</td>

                  <td>{transaction.reason || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Reports;
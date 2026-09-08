import { useEffect, useState } from "react";
import "./Supplier.css";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    supplierName: "",
    companyName: "",
    phone: "",
    email: "",
    address: "",
  });

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
      } else {
        console.error(data.message);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.supplierName ||
      !formData.companyName ||
      !formData.phone ||
      !formData.email ||
      !formData.address
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://inventory-management-system-1-5pa5.onrender.com/api/suppliers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Supplier added successfully!");

        setFormData({
          supplierName: "",
          companyName: "",
          phone: "",
          email: "",
          address: "",
        });

        fetchSuppliers();
      } else {
        alert(data.message || "Failed to add supplier");
      }
    } catch (error) {
      console.error("Error adding supplier:", error);
      alert("Server se connection nahi ho raha.");
    }
  };
  const handleEdit = async (supplier) => {
    const supplierName = window.prompt(
      "Enter supplier name:",
      supplier.supplierName
    );

    if (supplierName === null) return;

    const companyName = window.prompt(
      "Enter company name:",
      supplier.companyName
    );

    if (companyName === null) return;

    const phone = window.prompt(
      "Enter phone number:",
      supplier.phone
    );

    if (phone === null) return;

    const email = window.prompt(
      "Enter email:",
      supplier.email
    );

    if (email === null) return;

    const address = window.prompt(
      "Enter address:",
      supplier.address
    );

    if (address === null) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://inventory-management-system-1-5pa5.onrender.com/api/suppliers/${supplier._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            supplierName,
            companyName,
            phone,
            email,
            address,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Supplier updated successfully!");
        fetchSuppliers();
      } else {
        alert(data.message || "Failed to update supplier");
      }
    } catch (error) {
      console.error("Error updating supplier:", error);
      alert("Server se connection nahi ho raha.");
    }
  };
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this supplier?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://inventory-management-system-1-5pa5.onrender.com/api/suppliers/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Supplier deleted successfully!");
        fetchSuppliers();
      } else {
        alert(data.message || "Failed to delete supplier");
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert("Server se connection nahi ho raha.");
    }
  };

  return (
    <div className="suppliers-page">
      <div className="suppliers-header">
        <div>
          <h1>Suppliers</h1>
          <p>Manage your suppliers</p>
        </div>
      </div>

      <div className="supplier-form-card">
        <h2>Add Supplier</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Supplier Name</label>
              <input
                type="text"
                name="supplierName"
                value={formData.supplierName}
                onChange={handleChange}
                placeholder="Enter supplier name"
              />
            </div>

            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter supplier address"
              rows="3"
            ></textarea>
          </div>

          <button type="submit" className="supplier-btn">
            + Add Supplier
          </button>
        </form>
      </div>

      <div className="supplier-list-card">
        <h2>Supplier List</h2>

        {loading ? (
          <p>Loading suppliers...</p>
        ) : suppliers.length === 0 ? (
          <div className="empty-supplier">
            <div>🏢</div>
            <h3>No suppliers found</h3>
            <p>Add your first supplier using the form above.</p>
          </div>
        ) : (
          <div className="supplier-table-container">
            <table>
              <thead>
                <tr>
                  <th>Supplier Name</th>
                  <th>Company</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier._id}>
                    <td>{supplier.supplierName}</td>
                    <td>{supplier.companyName}</td>
                    <td>{supplier.phone}</td>
                    <td>{supplier.email}</td>
                    <td>{supplier.address}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(supplier)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(supplier._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Suppliers;
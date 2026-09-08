import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://inventory-management-system-1-5pa5.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/");
      } else {
        alert(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server se connection nahi ho raha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">📦</div>

        <h1>Inventory Management</h1>
        <p>Login to your account</p>

        <form onSubmit={handleLogin}>
          <div className="login-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "16px" }}>
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              fontWeight: "bold",
              padding: 0,
              color: "#6366f1",
            }}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
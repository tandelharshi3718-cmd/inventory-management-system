import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

function Layout() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
    };

    return (
        <div className="app">
            <aside className="sidebar">
                <h2>Inventory</h2>

                <nav>
                    <Link
                        to="/"
                        className={location.pathname === "/" ? "active" : ""}
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/products"
                        className={location.pathname === "/products" ? "active" : ""}
                    >
                        Products
                    </Link>
                    <Link
                        to="/supplier"
                        className={location.pathname === "/supplier" ? "active" : ""}
                    >
                        Suppliers
                    </Link>

                    <Link
                        to="/stock-in"
                        className={location.pathname === "/stock-in" ? "active" : ""}
                    >
                        Stock In
                    </Link>

                    <Link
                        to="/stock-out"
                        className={location.pathname === "/stock-out" ? "active" : ""}
                    >
                        Stock Out
                    </Link>

                    <Link
                        to="/reports"
                        className={location.pathname === "/reports" ? "active" : ""}
                    >
                        Reports
                    </Link>
                </nav>

                <div className="sidebar-bottom">
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
import React from "react";
import { Link } from "react-router-dom";
import logo1 from "../assets/logo1.png";
import "../styles/navbar.css";
import { useAuthentication } from "../Auth";

function Navbar() {
    const { isAuthorized } = useAuthentication(); // ✅ Call the hook

    const handleLogout = () => {
        // ✅ Clear tokens on logout
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("REFRESH_TOKEN");
        localStorage.removeItem("GOOGLE_ACCESS_TOKEN");
        window.location.href = "/login"; // Redirect to login
    };

    return (
        <nav className="navbar"> {/* ✅ Proper semantic HTML */}
            <a href="/" className="navbar-logo-link">
                <img src={logo1} className="navbar-logo" alt="logo1" />
            </a>

            <div className="navbar-menu-left">
                <Link to="/why" className="button-link-l">
                    WhyUs
                </Link>
                <Link to="/home" className="button-link-l">
                    Home
                </Link>
                <Link to="/contact" className="button-link-l">
                    Contact
                </Link>
            </div>

            <div className="navbar-menu-right">
                {isAuthorized ? (
                    <Link onClick={handleLogout} to="#" className="button-link">
                        Logout
                    </Link>
                ) : (
                    <>
                        <Link to="/login" className="button-link-login">
                            Login
                        </Link>
                        <Link to="/register" className="button-link">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthentication } from '../Auth';
import { authAPI } from '../pages/api2';
import '../styles/navbar2.css';

  function Navbar() {
  const { isAuth, logout } = useAuthentication();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // ─── Logout Handler ──────────────────────────────────────────────────────
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        await authAPI.logout({ refresh }); // Blacklist token on backend
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      logout(); // Clear tokens + redirect
      setLoggingOut(false);
      navigate('/login');
    }
  };

  // ─── Video Upload Handler ──────────────────────────────────────────────────
  const handleVideoUploadClick = () => {
    if (!isAuth) {
      navigate('/login');
      return;
    }
    // navigate to dedicated upload route
    navigate('/videoUpload');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        {/* ── Brand ── */}
        <Link to="/" className="brand">
          🔐 <span>AuthApp</span>
        </Link>

        {/* ── Desktop Links ── */}
        <ul className="navLinks">
          <li>
            <Link to="/" className="navLink">
              Home
            </Link>
          </li>

          {isAuth && (
            <li>
              <button
                onClick={handleVideoUploadClick}
                className="navLink videoUploadBtn"
              >
                📹 Upload Video
              </button>
            </li>
          )}

          {isAuth ? (
            <>
              <li>
                <Link to="/profile" className="navLink">
                  Profile
                </Link>
              </li>
              <li>
                <button
                  className="logoutBtn"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  {loggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="navLink">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="registerBtn">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* ── Mobile Hamburger ── */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`bar ${menuOpen ? 'barOpen1' : ''}`} />
          <span className={`bar ${menuOpen ? 'barOpen2' : ''}`} />
          <span className={`bar ${menuOpen ? 'barOpen3' : ''}`} />
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {/* ── Mobile Menu ── */}
<div className={`mobileMenu ${menuOpen ? 'mobileMenuOpen' : ''}`}>
  <Link
    to="/"
    className="mobileLink"
    onClick={() => setMenuOpen(false)}
  >
    Home
  </Link>

  {isAuth ? (
    <>
      <button
        onClick={handleVideoUploadClick}
        className="mobileLink videoUploadBtn"
      >
        📹 Upload Video
      </button>
      <Link
        to="/profile"
        className="mobileLink"
        onClick={() => setMenuOpen(false)}
      >
        Profile
      </Link>
      <button
        className="mobileLogoutBtn"
        onClick={() => {
          handleLogout();
          setMenuOpen(false);
        }}
        disabled={loggingOut}
      >
        {loggingOut ? 'Logging out...' : 'Logout'}
      </button>
    </>
  ) : (
    <>
      <Link
        to="/login"
        className="mobileLink"
        onClick={() => setMenuOpen(false)}
      >
        Login
      </Link>
      <Link
        to="/register"
        className="mobileLink"
        onClick={() => setMenuOpen(false)}
      >
        Register
      </Link>
    </>
  )}
</div>
        </nav>
        )
} 
export default Navbar
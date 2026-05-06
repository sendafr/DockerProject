import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../Components/api2';
import '../styles/auth.css';

function AuthsForm({ mode }) {
  const isLogin = mode === 'login';
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });

  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // clear field error on type
  };

  const flattenErrors = (data) => {
    const flat = {};
    Object.entries(data).forEach(([key, val]) => {
      flat[key] = Array.isArray(val) ? val.join(' ') : val;
    });
    return flat;
  };

  // ─── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const { data } = await authAPI.login({
          email:    formData.email,
          password: formData.password,
        });

        localStorage.setItem('access_token',  data.access);
        localStorage.setItem('refresh_token', data.refresh);
        // dispatch synthetic storage event so useAuthentication hook notices change
        setTimeout(() => window.dispatchEvent(new Event('storage')), 0);
        navigate('/');

      } else {
        await authAPI.register(formData);
        setSuccess('Account created! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }

    } catch (err) {
      if (err.response?.data) {
        setErrors(flattenErrors(err.response.data));
      } else {
        setErrors({ general: 'Network error. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="styles-wrapper">
      <div className="styles-card">

        {/* ── Logo / Title ── */}
        <div className="styles-logoWra">
          <div className="styles-logoIcon">🔐</div>
          <h2 className="styles-title">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="styless-ubtitle">
            {isLogin
              ? 'Sign in to your account'
              : 'Fill in the details below to register'}
          </p>
        </div>

        {/* ── General Error ── */}
        {errors.general && (
          <div className="styles-alertError">{errors.general}</div>
        )}

        {/* ── Success Message ── */}
        {success && (
          <div className="alertSuccess">{success}</div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} noValidate>

          {/* Username — Register only */}
          {!isLogin && (
            <div className="fieldGroup">
              <label className="label">Username</label>
              <input
                //className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
                type="text"
                name="username"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
              {errors.username && (
                <span className="fieldError">{errors.username}</span>
              )}
            </div>
          )}

          {/* Email */}
          <div className="fieldGroup">
            <label className="label">Email Address</label>
            <input
              //className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
            {errors.email && (
              <span className="fieldError">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="fieldGroup">
            <label className="label">Password</label>
            <input
              //className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
            {errors.password && (
              <span className="fieldError">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password — Register only */}
          {!isLogin && (
            <div className="fieldGroup">
              <label className="label">Confirm Password</label>
              <input
                //className={`${styles.input} ${errors.password2 ? styles.inputError : ''}`}
                type="password"
                name="password2"
                placeholder="••••••••"
                value={formData.password2}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              {errors.password2 && (
                <span className="fieldError">{errors.password2}</span>
              )}
            </div>
          )}

          {/* Forgot Password — Login only */}
          {isLogin && (
            <div className="forgotWrap">
              <Link to="/forgot-password" className="forgotLink">
                Forgot password?
              </Link>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="styles-button"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" />
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* ── Switch Mode ── */}
        <p className="switchText">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <Link
            to={isLogin ? '/register' : '/login'}
            className="switchLink"
          >
            {isLogin ? 'Register' : 'Login'}
          </Link>
        </p>

      </div>
    </div>
  );
}
export default AuthsForm;
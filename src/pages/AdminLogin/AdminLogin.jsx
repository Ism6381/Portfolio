import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./_adminLogin.scss";

const API_URL = import.meta.env.VITE_API_URL;

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      navigate("/admin");
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.message === "Invalid email or password"
          ? "Invalid email or password."
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="admin-login">
      <div className="admin-login__container">
        <Link
          to="/"
          className="admin-login__back"
        >
          ← Back to portfolio
        </Link>

        <div className="admin-login__content">
          <p className="admin-login__eyebrow">
            Admin Access
          </p>

          <h1>
            Welcome
            <span>back.</span>
          </h1>

          <p className="admin-login__description">
            Sign in to manage portfolio projects and content.
          </p>

          <form
            className="admin-login__form"
            onSubmit={handleSubmit}
          >
            <div className="admin-login__field">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="admin@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="admin-login__field">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <p className="admin-login__error">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Signing in..."
                : "Sign in"}

              <span>→</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default AdminLogin;
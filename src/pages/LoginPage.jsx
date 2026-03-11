import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
//import axios from 'axios';
import { authApi } from "../api/ArcticApi";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await authApi.login(email, password);
      console.log("🔥 Полный ответ от сервера:", data);
      console.log("🔥 Все ключи в ответе:", Object.keys(data));
      localStorage.setItem("accessToken", data.accessToken);
      // Сохраняем email (он приходит как lastName!)
      localStorage.setItem("userEmail", data.lastName);

      // Сохраняем роли (если есть)
      if (data.userRoles) {
        localStorage.setItem("userRoles", JSON.stringify(data.userRoles));
      }

      // Сохраняем individualNumber (он приходит как firstName!)
      if (data.firstName) {
        localStorage.setItem("individualNumber", data.firstName);
        console.log("✅ Сохранен individualNumber:", data.firstName);
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login__row">
        <div className="login__column">
          <div className="login__card">
            <div className="login__card-header">
              <h3>Вход в Arctic Metrics</h3>
            </div>
            <div className="login__card-body">
              {error && <div className="login__alert">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="login__form-field">
                  <label className="login__form-field-label">Email:</label>
                  <input
                    type="email"
                    className="login__form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="test@arctic.ru"
                    required
                  />
                </div>

                <div className="login__form-field">
                  <label className="login__form-field-label">Пароль:</label>
                  <input
                    type="password"
                    className="login__form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password123"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="login__button"
                  disabled={loading}
                >
                  {loading ? "Вход..." : "Войти"}
                </button>
              </form>

              <div className="login__footer">
                <Link to="/register" className="login__footer-link">
                  Нет аккаунта? Зарегистрироваться
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

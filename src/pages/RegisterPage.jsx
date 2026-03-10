import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
//import axios from 'axios';
import { authApi } from "../api/ArcticApi";

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authApi.register(formData);
      navigate("/login");
    } catch (error) {
      console.error("Register error:", error);
      setError(error.response?.data?.message || "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="register__row">
        <div className="register__column">
          <div className="refister__card">
            <div className="register__card-header register__card-header--success">
              <h3>Регистрация</h3>
            </div>
            <div className="register__card-body">
              {error && <div className="register__alert">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="register__form-fields">
                  <div className="register__form-fields-item--top">
                    <label className="register__form-label">Имя:</label>
                    <input
                      type="text"
                      className="register__form-input"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="register__form-fields-item--top">
                    <label className="register__form-label">Фамилия:</label>
                    <input
                      type="text"
                      className="register__form-input"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="register__form-fields-item--bottom">
                  <label className="register__form-label">Email:</label>
                  <input
                    type="email"
                    className="register__form-input"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="register__form-fields-item--bottom">
                  <label className="register__form-label">Пароль:</label>
                  <input
                    type="password"
                    className="register__form-input"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="register__button"
                  disabled={loading}
                >
                  {loading ? "Регистрация..." : "Зарегистрироваться"}
                </button>
              </form>

              <div className="register__footer">
                <Link to="/login" className="register__footer-link">
                  Уже есть аккаунт? Войти
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

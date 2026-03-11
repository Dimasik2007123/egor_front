import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import axios from 'axios';
import { adminApi } from "../api/ArcticApi";

function AdminPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await adminApi.getUsers();

      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load users:", error);
      setLoading(false);
    }
  };

  const handlePromoteToLeader = async (userId) => {
    if (window.confirm("Назначить этого пользователя руководителем?")) {
      try {
        await adminApi.promoteToLeader(userId);

        alert("Пользователь назначен руководителем!");
        loadUsers();
      } catch (error) {
        console.error("Failed to promote user:", error);
        alert("Ошибка при назначении");
      }
    }
  };

  const handlePromoteToAdmin = async (userId) => {
    if (window.confirm("Назначить этого пользователя администратором?")) {
      try {
        await adminApi.promoteToAdmin(userId);

        alert("Пользователь назначен администратором!");
        loadUsers();
      } catch (error) {
        console.error("Failed to promote user:", error);
        alert("Ошибка при назначении");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userRoles");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="admin__spinner">
        <div className="admin__spinner-status" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="admin__spinner-text">Загружаем данные...</p>
      </div>
    );
  }

  return (
    <div className="admin">
      {/* Шапка */}
      <div className="admin__header">
        <div>
          <h1 className="admin__title">👑 Админ-панель</h1>
          <p className="admin__subtitle">
            Управление системой Arctic Expedition
          </p>
        </div>
        <div className="admin__actions">
          <button
            onClick={() => navigate("/dashboard")}
            className="admin__button admin__button--outline"
          >
            ← На дашборд
          </button>
          <button
            onClick={handleLogout}
            className="admin__button admin__button--danger"
          >
            Выйти
          </button>
        </div>
      </div>

      {/* Статистика */}
      <div className="admin__stats">
        <div className="admin__stat">
          <div className="admin__stat-card admin__stat-card--primary">
            <h3 className="admin__stat-number">{users.length}</h3>
            <p className="admin__stat-label">Всего пользователей</p>
          </div>
        </div>

        <div className="admin__stat">
          <div className="admin__stat-card admin__stat-card--success">
            <h3 className="admin__stat-number">
              {users.filter((u) => u.roles?.includes("ROLE_ADMIN")).length}
            </h3>
            <p className="admin__stat-label">Администраторов</p>
          </div>
        </div>

        <div className="admin__stat">
          <div className="admin__stat-card admin__stat-card--warning">
            <h3 className="admin__stat-number">
              {users.filter((u) => u.roles?.includes("ROLE_LEADER")).length}
            </h3>
            <p className="admin__stat-label">Руководителей</p>
          </div>
        </div>

        <div className="admin__stat">
          <div className="admin__stat-card admin__stat-card--info">
            <h3 className="admin__stat-number">v1.0</h3>
            <p className="admin__stat-label">Версия системы</p>
          </div>
        </div>
      </div>

      {/* Таблица пользователей */}
      <div className="admin__table-container">
        <div className="admin__table-header">
          <h5 className="admin__table-title">Список пользователей</h5>
        </div>
        <div className="admin__table-responsive">
          <table className="admin__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Email</th>
                <th>Индивидуальный номер</th>
                <th>Роли</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    {user.firstName} {user.lastName}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <code className="admin__code">{user.individualNumber}</code>
                  </td>
                  <td>
                    <div className="admin__badges">
                      {user.roles?.map((role) => (
                        <span
                          key={role}
                          className={`admin__badge admin__badge--${
                            role === "ROLE_ADMIN"
                              ? "danger"
                              : role === "ROLE_LEADER"
                                ? "warning"
                                : "secondary"
                          }`}
                        >
                          {role.replace("ROLE_", "")}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="admin__button-group">
                      <button
                        className="admin__icon-button admin__icon-button--primary"
                        onClick={() => handlePromoteToLeader(user.id)}
                        disabled={user.roles?.includes("ROLE_LEADER")}
                        title="Сделать руководителем"
                      >
                        👑
                      </button>
                      <button
                        className="admin__icon-button admin__icon-button--danger"
                        onClick={() => handlePromoteToAdmin(user.id)}
                        disabled={user.roles?.includes("ROLE_ADMIN")}
                        title="Сделать администратором"
                      >
                        ⭐
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;

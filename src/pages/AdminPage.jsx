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
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRoles");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Загружаем данные...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>👑 Админ-панель</h1>
          <p className="text-muted">Управление системой Arctic Expedition</p>
        </div>
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-outline-secondary me-2"
          >
            ← На дашборд
          </button>
          <button onClick={handleLogout} className="btn btn-outline-danger">
            Выйти
          </button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h3>{users.length}</h3>
              <p className="mb-0">Всего пользователей</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h3>
                {users.filter((u) => u.roles?.includes("ROLE_ADMIN")).length}
              </h3>
              <p className="mb-0">Администраторов</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark">
            <div className="card-body text-center">
              <h3>
                {users.filter((u) => u.roles?.includes("ROLE_LEADER")).length}
              </h3>
              <p className="mb-0">Руководителей</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h3>v1.0</h3>
              <p className="mb-0">Версия системы</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Список пользователей</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
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
                      <code>{user.individualNumber}</code>
                    </td>
                    <td>
                      {user.roles?.map((role) => (
                        <span
                          key={role}
                          className={`badge me-1 ${
                            role === "ROLE_ADMIN"
                              ? "bg-danger"
                              : role === "ROLE_LEADER"
                                ? "bg-warning text-dark"
                                : "bg-secondary"
                          }`}
                        >
                          {role.replace("ROLE_", "")}
                        </span>
                      ))}
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handlePromoteToLeader(user.id)}
                          disabled={user.roles?.includes("ROLE_LEADER")}
                          title="Сделать руководителем"
                        >
                          👑
                        </button>
                        <button
                          className="btn btn-outline-danger"
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
    </div>
  );
}

export default AdminPage;

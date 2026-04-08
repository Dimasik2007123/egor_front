import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
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
        alert("Ошибка при назначении");
      }
    }
  };

  const handleDeleteAdminRole = async (userId) => {
    if (window.confirm("Удалить у пользователя роль администратора?")) {
      try {
        await adminApi.deleteAdminRole(userId);
        alert("Пользователь теперь не администратор!");
        loadUsers();
      } catch (error) {
        alert("Ошибка при удалении роли");
      }
    }
  };

  const handleDeleteLeaderRole = async (userId) => {
    if (window.confirm("Удалить у пользователя роль руководителя?")) {
      try {
        await adminApi.deleteLeaderRole(userId);
        alert("Пользователь теперь не руководитель!");
        loadUsers();
      } catch (error) {
        alert("Ошибка при удалении роли");
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
    return <div className="admin-spinner">Загрузка...</div>;
  }

  return (
    <div className="admin">
      <div className="admin__header">
        <div>
          <h1 className="admin__title">Админ-панель</h1>
          <p className="admin__subtitle">Управление системой Arctic Expedition</p>
        </div>
        <div className="admin__actions">
          <button onClick={() => navigate("/dashboard")} className="admin__button admin__button--outline">
            ← На дашборд
          </button>
          <button onClick={() => navigate("/admin/expeditions")} className="admin__button admin__button--primary">
            Управление экспедициями
          </button>
          <button onClick={handleLogout} className="admin__button admin__button--danger">
            Выйти
          </button>
        </div>
      </div>

      <div className="admin__stats">
        <div className="admin__stat">
          <div className="admin__stat-card admin__stat-card--primary">
            <h3 className="admin__stat-number">{users.length}</h3>
            <p className="admin__stat-label">Всего пользователей</p>
          </div>
        </div>
        <div className="admin__stat">
          <div className="admin__stat-card admin__stat-card--success">
            <h3 className="admin__stat-number">{users.filter(u => u.roles?.includes("ROLE_ADMIN")).length}</h3>
            <p className="admin__stat-label">Администраторов</p>
          </div>
        </div>
        <div className="admin__stat">
          <div className="admin__stat-card admin__stat-card--warning">
            <h3 className="admin__stat-number">{users.filter(u => u.roles?.includes("ROLE_LEADER")).length}</h3>
            <p className="admin__stat-label">Руководителей</p>
          </div>
        </div>
      </div>

      <div className="admin__table-container">
        <div className="admin__table-header">
          <h5 className="admin__table-title">Список пользователей</h5>
        </div>
        <div className="admin__table-responsive">
          <table className="admin__table">
            <thead>
              <tr><th>ID</th><th>Имя</th><th>Email</th><th>Индивидуальный номер</th><th>Роли</th><th>Действия</th></tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td><code className="admin__code">{user.individualNumber}</code></td>
                  <td>
                    <div className="admin__badges">
                      {user.roles?.map(role => (
                        <span key={role} className={`admin__badge admin__badge--${role === "ROLE_ADMIN" ? "danger" : role === "ROLE_LEADER" ? "warning" : "secondary"}`}>
                          {role.replace("ROLE_", "")}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="admin__button-group">
                      {!user.roles?.includes("ROLE_LEADER") ? (
                        <button className="admin__icon-button admin__icon-button--primary" onClick={() => handlePromoteToLeader(user.id)} title="Сделать руководителем">👑</button>
                      ) : (
                        <button className="admin__icon-button admin__icon-button--outline-danger" onClick={() => handleDeleteLeaderRole(user.id)} title="Удалить роль руководителя">👑</button>
                      )}
                      {!user.roles?.includes("ROLE_ADMIN") ? (
                        <button className="admin__icon-button admin__icon-button--danger" onClick={() => handlePromoteToAdmin(user.id)} title="Сделать администратором">⭐</button>
                      ) : (
                        <button className="admin__icon-button admin__icon-button--outline-danger" onClick={() => handleDeleteAdminRole(user.id)} title="Удалить роль администратора">⭐</button>
                      )}
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
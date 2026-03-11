import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import axios from 'axios';
import { expeditionApi, authApi, userApi } from "../api/ArcticApi";
import ExpeditionList from "../components/expeditions/ExpeditionList";
import CreateExpeditionModal from "../components/expeditions/CreateExpeditionModal";
import ManageParticipantsModal from "../components/expeditions/ManageParticipantsModal";
import EditExpeditionModal from "../components/expeditions/EditExpeditionModal";

function DashboardPage() {
  const [expeditions, setExpeditions] = useState({
    asLeader: [],
    asParticipant: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExpedition, setSelectedExpedition] = useState(null);
  const navigate = useNavigate();

  const isAdmin = () => {
    try {
      const rolesJson = localStorage.getItem("userRoles");
      const roles = rolesJson ? JSON.parse(rolesJson) : [];
      return roles.includes("ROLE_ADMIN");
    } catch (e) {
      return false;
    }
  };

  const isLeader = () => {
    try {
      const rolesJson = localStorage.getItem("userRoles");
      const roles = rolesJson ? JSON.parse(rolesJson) : [];
      return roles.includes("ROLE_LEADER");
    } catch (e) {
      return false;
    }
  };

  const canCreateExpedition = () => {
    return isAdmin() || isLeader();
  };

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await loadUserExpeditions();
    } catch (error) {
      console.error("Failed to load data:", error);
      if (error.response?.status === 401) {
        try {
          await loadUserExpeditions();
        } catch (refreshError) {
          handleLogout();
        }
      }
    }
  };

  const loadUserExpeditions = async () => {
    setLoading(true);
    try {
      const data = await expeditionApi.getMyExpeditions();
      setExpeditions(data);
      setLoading(false);
    } catch (error) {
      setError("Не удалось загрузить экспедиции");
      setLoading(false);
      throw error;
    }
  };

  /*const refreshToken = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/refresh",
        {},
        { withCredentials: true },
      );

      localStorage.setItem("accessToken", response.data.accessToken);
      return response.data.accessToken;
    } catch (error) {
      throw error;
    }
  };*/

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("username"); //
      localStorage.removeItem("userRoles");
      navigate("/login");
    }
  };

  const handleCreateExpedition = async (expeditionData) => {
    try {
      const data = await expeditionApi.createExpedition(expeditionData);

      await loadUserExpeditions();
      setShowCreateModal(false);

      return data;
    } catch (error) {
      console.error("Create expedition error:", error);
      throw error;
    }
  };

  const handleManageParticipants = (expedition) => {
    console.log("Opening participants modal for expedition:", expedition);
    setSelectedExpedition(expedition);
    setShowParticipantsModal(true);
  };

  const handleEditExpedition = (expedition) => {
    console.log("Opening edit modal for expedition:", expedition);
    setSelectedExpedition(expedition);
    setShowEditModal(true);
  };

  const handleUpdateExpedition = async (updatedData) => {
    try {
      await expeditionApi.editExpedition(selectedExpedition.id, updatedData);

      await loadUserExpeditions();
      setShowEditModal(false);
      setSelectedExpedition(null);
    } catch (error) {
      console.error("Update expedition error:", error);
      throw error;
    }
  };

  const handleDeleteExpedition = async () => {
    if (
      !window.confirm(
        "Вы уверены, что хотите удалить экспедицию? Это действие нельзя отменить.",
      )
    ) {
      return;
    }

    try {
      await expeditionApi.deleteExpedition(selectedExpedition.id);

      await loadUserExpeditions();
      setShowEditModal(false);
      setSelectedExpedition(null);
    } catch (error) {
      console.error("Delete expedition error:", error);
      alert("Не удалось удалить экспедицию");
    }
  };

  const handleAddParticipant = async (userId) => {
    try {
      await expeditionApi.addParticipant(selectedExpedition.id, userId);

      return true;
    } catch (error) {
      console.error("Add participant error:", error);
      throw error;
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    try {
      await expeditionApi.removeParticipant(
        selectedExpedition.id,
        participantId,
      );
      return true;
    } catch (error) {
      console.error("Remove participant error:", error);
      throw error;
    }
  };

  const handleSearchUser = async (individualNumber) => {
    try {
      const user = await userApi.searchByIndividualNumber(individualNumber);
      return user; // уже данные, не нужно вызывать .json()
    } catch (error) {
      throw error;
    }
  };

  const handleGetParticipants = async () => {
    try {
      const participants = await expeditionApi.getExpeditionParticipants(
        selectedExpedition.id,
      );
      return participants; // уже данные
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="dashboard__spinner">
        <div className="dashboard__spinner-status" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="dashboard__spinner-text">Загружаем ваши экспедиции...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">🏔️ Arctic Expedition Dashboard</h1>
          <p className="dashboard__subtitle">
            Добро пожаловать в систему мониторинга экспедиций
          </p>
        </div>
        <div className="dashboard__actions">
          {canCreateExpedition() && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="dashboard__button dashboard__button--primary"
              title="Создать новую экспедицию"
            >
              + Новая экспедиция
            </button>
          )}

          {isAdmin() && (
            <button
              onClick={() => navigate("/admin")}
              className="dashboard__button dashboard__button--warning"
              title="Перейти в админ-панель"
            >
              👑 Админ-панель
            </button>
          )}

          <button
            onClick={handleLogout}
            className="dashboard__button dashboard__button--outline-danger"
          >
            Выйти
          </button>
        </div>
      </div>

      {error && (
        <div className="dashboard__alert">
          {error}
          <button
            onClick={loadUserExpeditions}
            className="dashboard__alert-button"
          >
            Повторить
          </button>
        </div>
      )}

      <div className="dashboard__card">
        <div className="dashboard__card-header dashboard__card-header--primary">
          <h5 className="dashboard__card-title">
            👑 Мои экспедиции (как руководитель)
            <span className="dashboard__badge dashboard__badge--light">
              {expeditions.asLeader.length}
            </span>
          </h5>
        </div>
        <div className="dashboard__card-body">
          {expeditions.asLeader.length === 0 ? (
            <div className="dashboard__empty">
              <p className="dashboard__empty-text">
                Вы еще не создавали экспедиции
              </p>
              {canCreateExpedition() && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="dashboard__button dashboard__button--primary"
                >
                  Создать первую экспедицию
                </button>
              )}
            </div>
          ) : (
            <ExpeditionList
              expeditions={expeditions.asLeader}
              showRole={false}
              onRefresh={loadUserExpeditions}
              onManageParticipants={handleManageParticipants}
              onEditExpedition={handleEditExpedition}
            />
          )}
        </div>
      </div>

      <div className="dashboard__card">
        <div className="dashboard__card-header dashboard__card-header--success">
          <h5 className="dashboard__card-title">
            🧑‍🤝‍🧑 Мои экспедиции (как участник)
            <span className="dashboard__badge dashboard__badge--light dashboard__badge--success-text">
              {expeditions.asParticipant.length}
            </span>
          </h5>
        </div>
        <div className="dashboard__card-body">
          {expeditions.asParticipant.length === 0 ? (
            <div className="dashboard__empty">
              <p className="dashboard__empty-text">
                Вы еще не участвовали в экспедициях
              </p>
              <p className="dashboard__empty-small">
                Попросите руководителя добавить вас в экспедицию по вашему
                индивидуальному номеру
              </p>
            </div>
          ) : (
            <ExpeditionList
              expeditions={expeditions.asParticipant}
              showRole={false}
              onRefresh={loadUserExpeditions}
              onManageParticipants={handleManageParticipants}
              onEditExpedition={handleEditExpedition}
            />
          )}
        </div>
      </div>

      {canCreateExpedition() && (
        <CreateExpeditionModal
          show={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateExpedition}
        />
      )}

      {showParticipantsModal && selectedExpedition && (
        <ManageParticipantsModal
          show={showParticipantsModal}
          onClose={() => {
            setShowParticipantsModal(false);
            setSelectedExpedition(null);
          }}
          expeditionId={selectedExpedition.id}
          expeditionName={selectedExpedition.name}
          onAddParticipant={handleAddParticipant}
          onRemoveParticipant={handleRemoveParticipant}
          onSearchUser={handleSearchUser}
          onGetParticipants={handleGetParticipants}
        />
      )}

      {showEditModal && selectedExpedition && (
        <EditExpeditionModal
          show={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedExpedition(null);
          }}
          expedition={selectedExpedition}
          onUpdate={handleUpdateExpedition}
          onDelete={handleDeleteExpedition}
        />
      )}
    </div>
  );
}

export default DashboardPage;

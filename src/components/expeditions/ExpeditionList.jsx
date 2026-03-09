import { useState } from "react";
import { useNavigate } from "react-router-dom";
//import axios from 'axios';
import { expeditionApi } from "../../api/ArcticApi";

function ExpeditionList({
  expeditions,
  showRole = true,
  onRefresh,
  onManageParticipants,
  onEditExpedition,
}) {
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState(null);

  const isLeader = (expedition) => {
    return expedition.role === "LEADER";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ru-RU");
  };

  const handleExpeditionClick = (expedition) => {
    console.log("Clicked expedition:", expedition.id, "Role:", expedition.role);

    if (expedition.role === "LEADER") {
      // Для руководителя - участники
      navigate(`/expeditions/${expedition.id}/participants`);
    } else {
      // Для участника - метрики
      navigate(`/expeditions/${expedition.id}/my-metrics`);
    }
  };

  const handleDetailsClick = (expedition, e) => {
    e.stopPropagation(); // Останавливаем всплытие
    navigate(`/expeditions/${expedition.id}`);
  };

  const handleManageParticipants = (expedition, e) => {
    e.stopPropagation(); // Останавливаем всплытие
    if (onManageParticipants) {
      onManageParticipants(expedition);
    }
  };

  const handleEditExpedition = (expedition, e) => {
    e.stopPropagation(); // Останавливаем всплытие
    if (onEditExpedition) {
      onEditExpedition(expedition);
    }
  };

  const handleLeaveExpedition = async (expeditionId, e) => {
    e.stopPropagation(); // Останавливаем всплытие

    if (!window.confirm("Вы уверены, что хотите покинуть экспедицию?")) {
      return;
    }

    setActionLoading(expeditionId);
    try {
      await expeditionApi.leaveExpedition(expeditionId);

      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error leaving expedition:", error);
      alert("Ошибка при выходе из экспедиции");
    } finally {
      setActionLoading(null);
    }
  };

  if (expeditions.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted">Нет экспедиций для отображения</p>
      </div>
    );
  }

  return (
    <div className="list-group">
      {expeditions.map((expedition) => (
        <div
          key={expedition.id}
          className="list-group-item list-group-item-action"
          onClick={() => handleExpeditionClick(expedition)}
          style={{ cursor: "pointer" }}
        >
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-grow-1">
              <h5 className="mb-1">{expedition.name}</h5>

              <p className="mb-1 text-muted">
                {expedition.description || "Нет описания"}
              </p>

              <div className="d-flex gap-3 text-muted small mb-2">
                <div>
                  <strong>Даты:</strong> {formatDate(expedition.startDate)} -{" "}
                  {formatDate(expedition.endDate)}
                </div>
                <div>
                  <strong>Руководитель:</strong> {expedition.leaderFirstName}{" "}
                  {expedition.leaderLastName}
                </div>
                {showRole && expedition.role && (
                  <div>
                    <span
                      className={`badge ${expedition.role === "LEADER" ? "bg-primary" : "bg-success"}`}
                    >
                      {expedition.role === "LEADER"
                        ? "Руководитель"
                        : "Участник"}
                    </span>
                  </div>
                )}
              </div>

              <div className="text-muted small">
                Создана:{" "}
                {new Date(expedition.createdAt).toLocaleDateString("ru-RU")}
              </div>
            </div>

            <div
              className="d-flex flex-column gap-2 ms-3"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="btn btn-outline-info btn-sm"
                onClick={(e) => handleDetailsClick(expedition, e)}
                title="Подробнее об экспедиции"
              >
                ℹ️ Подробнее
              </button>
              {isLeader(expedition) ? (
                <>
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={(e) => handleManageParticipants(expedition, e)}
                    title="Управление участниками"
                  >
                    👥 Участники
                  </button>

                  <button
                    className="btn btn-outline-warning btn-sm"
                    onClick={(e) => handleEditExpedition(expedition, e)}
                    title="Редактировать экспедицию"
                  >
                    ✏️ Редактировать
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={(e) => handleLeaveExpedition(expedition.id, e)}
                  disabled={actionLoading === expedition.id}
                  title="Покинуть экспедицию"
                >
                  {actionLoading === expedition.id ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    "🚪 Покинуть"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExpeditionList;

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
      <div className="expedition-list__empty">
        <p className="expedition-list__empty-text">
          Нет экспедиций для отображения
        </p>
      </div>
    );
  }

  return (
    <div className="expedition-list">
      {expeditions.map((expedition) => (
        <div
          key={expedition.id}
          className="expedition-list__item"
          onClick={() => handleExpeditionClick(expedition)}
        >
          <div className="expedition-list__content">
            <div className="expedition-list__info">
              <h5 className="expedition-list__title">
                {expedition.name}{" "}
                {showRole && expedition.role && (
                  <div className="expedition-list__role">
                    <span
                      className={`expedition-list__badge ${
                        expedition.role === "LEADER"
                          ? "expedition-list__badge--primary"
                          : "expedition-list__badge--success"
                      }`}
                    >
                      {expedition.role === "LEADER"
                        ? "Руководитель"
                        : "Участник"}
                    </span>
                  </div>
                )}
              </h5>

              <p className="expedition-list__description">
                {expedition.description || "Нет описания"}
              </p>

              <div className="expedition-list__meta">
                <div className="expedition-list__dates">
                  <strong>Даты:</strong> {formatDate(expedition.startDate)} -{" "}
                  {formatDate(expedition.endDate)}
                </div>
                <div className="expedition-list__leader">
                  <strong>Руководитель:</strong> {expedition.leaderFirstName}{" "}
                  {expedition.leaderLastName}
                </div>
              </div>

              <div className="expedition-list__created">
                Создана:{" "}
                {new Date(expedition.createdAt).toLocaleDateString("ru-RU")}
              </div>
            </div>

            <div
              className="expedition-list__actions"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="expedition-list__button expedition-list__button--info"
                onClick={(e) => handleDetailsClick(expedition, e)}
                title="Подробнее об экспедиции"
              >
                ℹ️ Подробнее
              </button>
              {isLeader(expedition) ? (
                <>
                  <button
                    className="expedition-list__button expedition-list__button--success"
                    onClick={(e) => handleManageParticipants(expedition, e)}
                    title="Управление участниками"
                  >
                    👥 Участники
                  </button>

                  <button
                    className="expedition-list__button expedition-list__button--warning"
                    onClick={(e) => handleEditExpedition(expedition, e)}
                    title="Редактировать экспедицию"
                  >
                    ✏️ Редактировать
                  </button>
                </>
              ) : (
                <button
                  className="expedition-list__button expedition-list__button--danger"
                  onClick={(e) => handleLeaveExpedition(expedition.id, e)}
                  disabled={actionLoading === expedition.id}
                  title="Покинуть экспедицию"
                >
                  {actionLoading === expedition.id ? (
                    <span className="expedition-list__spinner"></span>
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

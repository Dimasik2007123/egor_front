import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import axios from 'axios';
import { expeditionApi } from "../api/ArcticApi";

function ExpeditionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [expedition, setExpedition] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    loadExpeditionData();
  }, [id]);

  const loadExpeditionData = async () => {
    try {
      const myExpeditions = await expeditionApi.getMyExpeditions();
      const data = [
        ...myExpeditions.asLeader,
        ...myExpeditions.asParticipant,
      ].find((exp) => exp.id === parseInt(id));

      setExpedition(data);
      if (data.role === "LEADER") {
        await loadParticipants();
      }

      setLoading(false);
    } catch (error) {
      console.error("Failed to load expedition:", error);
      setError("Не удалось загрузить информацию об экспедиции");
      setLoading(false);

      if (error.response?.status === 404) {
        navigate("/dashboard");
      }
    }
  };

  const loadParticipants = async () => {
    try {
      const data = await expeditionApi.getExpeditionParticipants(id);
      setParticipants(data);
    } catch (error) {
      console.error("Failed to load participants:", error);
    }
  };

  const handleViewMyMetrics = () => {
    navigate(`/expeditions/${id}/my-metrics`);
  };

  const handleViewParticipantMetrics = (participantId) => {
    navigate(`/expeditions/${id}/participants/${participantId}/metrics`);
  };

  const handleAddParticipant = async () => {
    const individualNumber = prompt(
      "Введите индивидуальный номер участника (например: ARCTIC-A1B2C3D4):",
    );

    if (!individualNumber) return;

    try {
      await expeditionApi.addParticipant(id, individualNumber);
      alert("Участник успешно добавлен!");
      await loadParticipants();
    } catch (error) {
      console.error("Failed to add participant:", error);
      alert(
        "Ошибка при добавлении участника: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    if (
      !window.confirm("Вы уверены, что хотите удалить участника из экспедиции?")
    ) {
      return;
    }

    try {
      await expeditionApi.removeParticipant(id, participantId);
      alert("Участник удален из экспедиции!");
      await loadParticipants();
    } catch (error) {
      console.error("Failed to remove participant:", error);
      alert("Ошибка при удалении участника");
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const renderActionButtons = () => {
    if (!expedition) return null;

    if (expedition.role === "USER") {
      return (
        <button
          className="expedition-detail__button--metrics"
          onClick={handleViewMyMetrics}
          style={{ minWidth: "200px" }}
        >
          📊 Просмотреть мои метрики
        </button>
      );
    } else if (expedition.role === "LEADER") {
      return (
        <div
          className="expedition-detail__leader-block"
          style={{ maxWidth: "300px" }}
        >
          <button
            className="expedition-detail__button--metrics"
            onClick={handleViewMyMetrics}
          >
            📊 Мои метрики (как участник)
          </button>
          <button
            className="expedition-detail__button--management"
            onClick={() => setActiveTab("participants")}
          >
            👥 Управление участниками
          </button>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="expedition-detail__spinner">
        <div className="expedition-detail__spinner-status" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="expedition-detail__spinner-text">
          Загружаем информацию об экспедиции...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="expedition-detail__error">
        <div className="expedition-detail__error-content">
          <h4>Ошибка</h4>
          <p>{error}</p>
          <button
            onClick={handleBack}
            className="expedition-detail__button--back"
          >
            Вернуться к списку экспедиций
          </button>
        </div>
      </div>
    );
  }

  if (!expedition) {
    return (
      <div className="expedition-detail__not-found">
        <div className="expedition-detailt__not-found-content">
          <h4>Экспедиция не найдена</h4>
          <button
            onClick={handleBack}
            className="expedition-detail__button--back"
          >
            Вернуться к списку экспедиций
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="expedition-detail">
      <div className="expedition-detail__wrapper">
        <button
          onClick={handleBack}
          className="expedition-detail__button--back"
        >
          ← Назад к списку экспедиций
        </button>

        <div className="expedition-detail__card">
          <div className="expedition-detail__card-header">
            <h2 className="expedition-detail__card-header-text">
              🏔️ {expedition.name}
            </h2>
          </div>

          {/* Табы для навигации */}
          <div className="expedition-detail__tabs">
            <ul className="expedition-detail__tabs-list">
              <li className="expedition-detail__tabs-list-item">
                <button
                  className={`expedition-detail__tab-button ${activeTab === "info" ? "expedition-detail__tab-button--active" : ""}`}
                  onClick={() => setActiveTab("info")}
                >
                  📋 Информация
                </button>
              </li>
              {expedition.role === "LEADER" && (
                <li className="expedition-detail__tabs-list-item">
                  <button
                    className={`expedition-detail__tab-button ${activeTab === "participants" ? "expedition-detail__tab-button--active" : ""}`}
                    onClick={() => setActiveTab("participants")}
                  >
                    👥 Участники ({participants.length})
                  </button>
                </li>
              )}
            </ul>
          </div>

          <div className="expedition-detail__card-body">
            {activeTab === "info" && (
              <div className="expedition-detail__card-row">
                <div className="expedition-detail__card-column">
                  <h5>Информация об экспедиции</h5>
                  <ul className="expedition-detail__list">
                    <li className="expedition-detail__list-item">
                      <strong>ID:</strong> {expedition.id}
                    </li>
                    <li className="expedition-detail__list-item">
                      <strong>Руководитель:</strong>{" "}
                      {expedition.leaderFirstName} {expedition.leaderLastName}
                    </li>
                    <li className="expedition-detail__list-item">
                      <strong>Email руководителя:</strong>{" "}
                      {expedition.leaderEmail}
                    </li>
                    <li className="expedition-detail__list-item">
                      <strong>Ваша роль:</strong>
                      <span
                        className={`expedition-detail__badge ${expedition.role === "LEADER" ? "expedition-detail__badge--warning" : "expedition-detail__badge--success"}`}
                      >
                        {expedition.role === "LEADER"
                          ? "Руководитель"
                          : "Участник"}
                      </span>
                    </li>
                    <li className="expedition-detail__list-item">
                      <strong>Дата начала:</strong>{" "}
                      {new Date(expedition.startDate).toLocaleDateString(
                        "ru-RU",
                      )}
                    </li>
                    <li className="expedition-detail__list-item">
                      <strong>Дата окончания:</strong>{" "}
                      {new Date(expedition.endDate).toLocaleDateString("ru-RU")}
                    </li>
                    <li className="expedition-detail__list-item">
                      <strong>Создана:</strong>{" "}
                      {new Date(expedition.createdAt).toLocaleString("ru-RU")}
                    </li>
                  </ul>
                </div>

                <div className="expedition-detail__card-column">
                  <h5>Действия</h5>
                  <div className="expedition-detail__actions">
                    {renderActionButtons()}
                  </div>

                  <h5>Статистика</h5>
                  <div className="expedition-detail__stats">
                    <div className="expedition-detail__stats-item">
                      <div className="expedition-detail__stats-card">
                        <h3>👥</h3>
                        <h4>{participants.length}</h4>
                        <p className="expedition-detail__text--muted">
                          Участников
                        </p>
                      </div>
                    </div>
                    <div className="expedition-detail__stats-item">
                      <div className="expedition-detail__stats-card">
                        <h3>📊</h3>
                        <h4>0</h4>
                        <p className="expedition-detail__text--muted">Метрик</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "participants" && expedition.role === "LEADER" && (
              <div className="expedition-detail__participants">
                <div className="expedition-detail__participants-header">
                  <h5 className="mb-0">Участники экспедиции</h5>
                  <button
                    className="expedition-detail__button expedition-detail__button--add"
                    onClick={handleAddParticipant}
                  >
                    + Добавить участника
                  </button>
                </div>

                {participants.length === 0 ? (
                  <div className="expedition-detail__empty-participants">
                    <div className="expedition-detail__empty-icon">👥</div>
                    <p className="expedition-details__empty-text--muted">
                      В экспедиции пока нет участников
                    </p>
                    <p className="expedition-details__empty-text--muted expedition-details__empty-text--small">
                      Добавьте участников по их индивидуальному номеру
                    </p>
                    <button
                      className="expedition-detail__button expedition-detail__button--primary"
                      onClick={handleAddParticipant}
                    >
                      + Добавить первого участника
                    </button>
                  </div>
                ) : (
                  <div className="expedition-detail__table-responsive">
                    <table className="expedition-detail__table">
                      <thead className="expedition-detail__table-head">
                        <tr>
                          <th>Имя</th>
                          <th>Email</th>
                          <th>Индивидуальный номер</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {participants.map((participant) => (
                          <tr key={participant.user.id}>
                            <td>
                              <strong>
                                {participant.user.firstName}{" "}
                                {participant.user.lastName}
                              </strong>
                            </td>
                            <td>{participant.user.email}</td>
                            <td>
                              <code className="expedition-detail__code">
                                {participant.user.individualNumber}
                              </code>
                            </td>
                            <td>
                              <div className="expedition-detail__btn-group">
                                <button
                                  className="expedition-detail__button expedition-detail__button--outline-primary"
                                  onClick={() =>
                                    handleViewParticipantMetrics(
                                      participant.participantId,
                                    )
                                  }
                                  title="Просмотреть метрики"
                                >
                                  📊 Метрики
                                </button>
                                <button
                                  className="expedition-detail__button expedition-detail__button--outline-danger"
                                  onClick={() =>
                                    handleRemoveParticipant(
                                      participant.participantId,
                                    )
                                  }
                                  title="Удалить из экспедиции"
                                >
                                  Удалить
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="expedition-detail__info">
                  <h6>💡 Информация:</h6>
                  <ul>
                    <li>
                      Чтобы добавить участника, попросите его индивидуальный
                      номер (формат: ARCTIC-XXXXX)
                    </li>
                    <li>
                      Нажмите "Метрики" чтобы просмотреть показатели участника
                    </li>
                    <li>
                      Руководитель автоматически добавлен в экспедицию как
                      участник
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "info" && (
              <div className="expedition-detail__description">
                <h5>Описание экспедиции</h5>
                <div className="expedition-detail__description-card">
                  <div className="expedition-detail__description-card-body">
                    {expedition.description ? (
                      <p className="expedition-detail__description-text--wrap">
                        {expedition.description}
                      </p>
                    ) : (
                      <p className="expedition-detail__description-text--muted">
                        Описание не добавлено. Вы можете добавить описание при
                        редактировании экспедиции.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpeditionDetailPage;

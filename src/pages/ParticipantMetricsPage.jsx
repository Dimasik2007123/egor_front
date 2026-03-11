import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import axios from 'axios';
import { chartsApi, expeditionApi } from "../api/ArcticApi";

function ParticipantMetricsPage() {
  const { expeditionId, participantId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [charts, setCharts] = useState(null);
  const [participant, setParticipant] = useState(null);
  const [expedition, setExpedition] = useState(null);

  useEffect(() => {
    loadData();
  }, [expeditionId, participantId]);

  const loadData = async () => {
    try {
      const myExpeditions = await expeditionApi.getMyExpeditions();

      const allExpeditions = [
        ...(myExpeditions.asLeader || []),
        ...(myExpeditions.asParticipant || []),
      ];

      const foundExpedition = allExpeditions.find(
        (exp) => exp.id === parseInt(expeditionId),
      );

      if (!foundExpedition) {
        throw new Error("Экспедиция не найдена");
      }

      setExpedition(foundExpedition);

      const participantsData =
        await expeditionApi.getExpeditionParticipants(expeditionId);

      console.log("Participants data from API:", participantsData);

      const foundParticipant = participantsData.find(
        (p) => p.participantId.toString() === participantId,
      );

      if (!foundParticipant) {
        throw new Error("Участник не найден");
      }

      setParticipant(foundParticipant);

      const chartsData = await chartsApi.getParticipantCharts(
        expeditionId,
        foundParticipant.user.individualNumber,
      );

      setCharts(chartsData);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load participant metrics:", error);
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/expeditions/${expeditionId}`);
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Загружаем метрики участника...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="participant-metrics__spinner">
        <div className="participant-metrics__spinner-status" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="participant-metrics__spinner-text">
          Загружаем метрики участника...
        </p>
      </div>
    );
  }

  if (!participant) {
    return (
      <div className="participant-metrics__error">
        <div className="participant-metrics__error-content">
          <h4 className="participant-metrics__error-title">Ошибка</h4>
          <p className="participant-metrics__error-message">
            Участник не найден
          </p>
          <button
            onClick={handleBack}
            className="participant-metrics__error-button"
          >
            Вернуться к экспедиции
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="participant-metrics">
      <div className="participant-metrics__header">
        <button
          onClick={handleBack}
          className="participant-metrics__back-button"
        >
          ← Назад к экспедиции
        </button>
        <div className="participant-metrics__title-wrapper">
          <h2 className="participant-metrics__title">📊 Метрики участника</h2>
          {expedition && (
            <p className="participant-metrics__subtitle">
              Экспедиция: {expedition.name} | Участник: {participant.firstName}{" "}
              {participant.lastName}
            </p>
          )}
        </div>
      </div>

      <div className="participant-metrics__info-card">
        <div className="participant-metrics__info-header">
          <h5 className="participant-metrics__info-title">
            👤 Информация об участнике
          </h5>
        </div>
        <div className="participant-metrics__info-body">
          <div className="participant-metrics__info-row">
            <div className="participant-metrics__info-col">
              <p className="participant-metrics__info-text">
                <strong>Имя:</strong> {participant.user.firstName}{" "}
                {participant.user.lastName}
              </p>
            </div>
            <div className="participant-metrics__info-col">
              <p className="participant-metrics__info-text">
                <strong>Email:</strong> {participant.user.email}
              </p>
            </div>
            <div className="participant-metrics__info-col">
              <p className="participant-metrics__info-text">
                <strong>Индивидуальный номер:</strong>
              </p>
              <code className="participant-metrics__code">
                {participant.user.individualNumber}
              </code>
            </div>
            <div className="participant-metrics__info-col">
              <p className="participant-metrics__info-text">
                <strong>Роль в экспедиции:</strong>
              </p>
              <span className="participant-metrics__badge">Участник</span>
            </div>
          </div>
        </div>
      </div>

      {charts?.stats && (
        <div className="participant-metrics__stats">
          <div className="participant-metrics__stats-column">
            <div className="participant-metrics__stats-card">
              <h5 className="participant-metrics__stats-title">
                😴 Средняя усталость
              </h5>
              <h3
                className={`participant-metrics__stats-value ${
                  charts.stats.fatigue?.avg > 7
                    ? "participant-metrics__stats-value--danger"
                    : "participant-metrics__stats-value--warning"
                }`}
              >
                {charts.stats.fatigue?.avg || "—"}
              </h3>
              <small className="participant-metrics__stats-range">из 10</small>
            </div>
          </div>

          <div className="participant-metrics__stats-column">
            <div className="participant-metrics__stats-card">
              <h5 className="participant-metrics__stats-title">
                <span className="heart-icon">❤️</span> Средний пульс
              </h5>
              <h3
                className={`participant-metrics__stats-value ${
                  charts.stats.heart_rate?.avg > 100
                    ? "participant-metrics__stats-value--danger"
                    : charts.stats.heart_rate?.avg < 60
                      ? "participant-metrics__stats-value--warning"
                      : "participant-metrics__stats-value--success"
                }`}
              >
                {charts.stats.heart_rate?.avg || "—"}
              </h3>
              <small className="participant-metrics__stats-range">уд/мин</small>
            </div>
          </div>

          <div className="participant-metrics__stats-column">
            <div className="participant-metrics__stats-card">
              <h5 className="participant-metrics__stats-title">
                🎯 Средняя концентрация
              </h5>
              <h3
                className={`participant-metrics__stats-value ${
                  charts.stats.concentration?.avg < 5
                    ? "participant-metrics__stats-value--danger"
                    : "participant-metrics__stats-value--success"
                }`}
              >
                {charts.stats.concentration?.avg || "—"}
              </h3>
              <small className="participant-metrics__stats-range">из 10</small>
            </div>
          </div>

          <div className="participant-metrics__stats-column">
            <div className="participant-metrics__stats-card">
              <h5 className="participant-metrics__stats-title">
                📈 Средняя продуктивность
              </h5>
              <h3
                className={`participant-metrics__stats-value ${
                  charts.stats.productivity?.avg < 5
                    ? "participant-metrics__stats-value--danger"
                    : "participant-metrics__stats-value--primary"
                }`}
              >
                {charts.stats.productivity?.avg || "—"}
              </h3>
              <small className="participant-metrics__stats-range">из 10</small>
            </div>
          </div>
        </div>
      )}

      <div className="participant-metrics__charts">
        {charts?.charts?.fatigue_chart && (
          <div className="participant-metrics__charts-full">
            <div className="participant-metrics__charts-card">
              <div className="participant-metrics__charts-header">
                <h5 className="participant-metrics__charts-title">
                  📈 Динамика усталости и концентрации
                </h5>
              </div>
              <div className="participant-metrics__charts-body">
                <div
                  dangerouslySetInnerHTML={{
                    __html: charts.charts.fatigue_chart,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {charts?.charts?.heart_rate_chart && (
          <div className="participant-metrics__charts-half">
            <div className="participant-metrics__charts-card">
              <div className="participant-metrics__charts-card-header">
                <h5 className="participant-metrics__charts-card-title">
                  <span className="heart-icon">❤️</span> Частота сердечных
                  сокращений
                </h5>
              </div>
              <div className="participant-metrics__charts-body">
                <div
                  dangerouslySetInnerHTML={{
                    __html: charts.charts.heart_rate_chart,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {charts?.charts?.composite_chart && (
          <div className="participant-metrics__charts-half">
            <div className="participant-metrics__charts-card">
              <div className="participant-metrics__charts-card-header">
                <h5 className="participant-metrics__charts-card-title">
                  📊 Комбинированные показатели
                </h5>
              </div>
              <div className="participant-metrics__charts-card-body">
                <div
                  dangerouslySetInnerHTML={{
                    __html: charts.charts.composite_chart,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="participant-metrics__recommendations">
        <div className="participant-metrics__recommendations-header">
          <h5 className="participant-metrics__recommendations-title">
            💡 Рекомендации для руководителя
          </h5>
        </div>
        <div className="participant-metrics__recommendations-body">
          {charts?.stats && (
            <>
              {charts.stats.fatigue?.avg > 7 && (
                <div className="participant-metrics__alert--warning">
                  <strong>⚠️ Высокий уровень усталости:</strong> Рекомендуется
                  дать участнику отдых или снизить нагрузку.
                </div>
              )}

              {charts.stats.heart_rate?.avg > 100 && (
                <div className="participant-metrics__alert--danger">
                  <strong>🚨 Высокий пульс:</strong> Участник испытывает
                  повышенную нагрузку. Проверьте его физическое состояние.
                </div>
              )}

              {charts.stats.concentration?.avg < 5 && (
                <div className="participant-metrics__alert--warning">
                  <strong>⚠️ Низкая концентрация:</strong> Участнику может быть
                  трудно выполнять сложные задачи.
                </div>
              )}

              {charts.stats.fatigue?.avg <= 7 &&
                charts.stats.heart_rate?.avg <= 100 &&
                charts.stats.concentration?.avg >= 5 && (
                  <div className="participant-metrics__alert--success">
                    <strong>✅ Состояние в норме:</strong> Участник в хорошей
                    форме для продолжения работы.
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ParticipantMetricsPage;

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
      const expeditionData =
        await expeditionApi.getExpeditionDetails(expeditionId);
      setExpedition(expeditionData);

      const participantsData =
        await expeditionApi.getExpeditionParticipants(expeditionId);

      const foundParticipant = participantsData.find(
        (p) => p.id.toString() === participantId,
      );

      if (!foundParticipant) {
        throw new Error("Участник не найден");
      }

      setParticipant(foundParticipant);

      const chartsData = await chartsApi.getParticipantCharts(
        expeditionId,
        foundParticipant.individualNumber,
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

  if (!participant) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Ошибка</h4>
          <p>Участник не найден</p>
          <button onClick={handleBack} className="btn btn-primary">
            Вернуться к экспедиции
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button
            onClick={handleBack}
            className="btn btn-outline-secondary me-3"
          >
            ← Назад к экспедиции
          </button>
          <h2 className="d-inline">📊 Метрики участника</h2>
          {expedition && (
            <p className="text-muted mb-0">
              Экспедиция: {expedition.name} | Участник: {participant.firstName}{" "}
              {participant.lastName}
            </p>
          )}
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">👤 Информация об участнике</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <p>
                <strong>Имя:</strong> {participant.firstName}{" "}
                {participant.lastName}
              </p>
            </div>
            <div className="col-md-3">
              <p>
                <strong>Email:</strong> {participant.email}
              </p>
            </div>
            <div className="col-md-3">
              <p>
                <strong>Индивидуальный номер:</strong>
              </p>
              <code>{participant.individualNumber}</code>
            </div>
            <div className="col-md-3">
              <p>
                <strong>Роль в экспедиции:</strong>
              </p>
              <span className="badge bg-success">Участник</span>
            </div>
          </div>
        </div>
      </div>

      {charts?.stats && (
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card bg-light">
              <div className="card-body text-center">
                <h5>😴 Средняя усталость</h5>
                <h3
                  className={
                    charts.stats.fatigue?.avg > 7
                      ? "text-danger"
                      : "text-warning"
                  }
                >
                  {charts.stats.fatigue?.avg || "—"}
                </h3>
                <small className="text-muted">из 10</small>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card bg-light">
              <div className="card-body text-center">
                <h5>❤️ Средний пульс</h5>
                <h3
                  className={
                    charts.stats.heart_rate?.avg > 100
                      ? "text-danger"
                      : charts.stats.heart_rate?.avg < 60
                        ? "text-warning"
                        : "text-success"
                  }
                >
                  {charts.stats.heart_rate?.avg || "—"}
                </h3>
                <small className="text-muted">уд/мин</small>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card bg-light">
              <div className="card-body text-center">
                <h5>🎯 Средняя концентрация</h5>
                <h3
                  className={
                    charts.stats.concentration?.avg < 5
                      ? "text-danger"
                      : "text-success"
                  }
                >
                  {charts.stats.concentration?.avg || "—"}
                </h3>
                <small className="text-muted">из 10</small>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card bg-light">
              <div className="card-body text-center">
                <h5>📈 Средняя продуктивность</h5>
                <h3
                  className={
                    charts.stats.productivity?.avg < 5
                      ? "text-danger"
                      : "text-primary"
                  }
                >
                  {charts.stats.productivity?.avg || "—"}
                </h3>
                <small className="text-muted">из 10</small>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        {charts?.charts?.fatigue_chart && (
          <div className="col-md-12 mb-4">
            <div className="card">
              <div className="card-header">
                <h5>📈 Динамика усталости и концентрации</h5>
              </div>
              <div className="card-body">
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
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5>❤️ Частота сердечных сокращений</h5>
              </div>
              <div className="card-body">
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
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5>📊 Комбинированные показатели</h5>
              </div>
              <div className="card-body">
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

      <div className="card mb-4">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">💡 Рекомендации для руководителя</h5>
        </div>
        <div className="card-body">
          {charts?.stats && (
            <>
              {charts.stats.fatigue?.avg > 7 && (
                <div className="alert alert-warning">
                  <strong>⚠️ Высокий уровень усталости:</strong> Рекомендуется
                  дать участнику отдых или снизить нагрузку.
                </div>
              )}

              {charts.stats.heart_rate?.avg > 100 && (
                <div className="alert alert-danger">
                  <strong>🚨 Высокий пульс:</strong> Участник испытывает
                  повышенную нагрузку. Проверьте его физическое состояние.
                </div>
              )}

              {charts.stats.concentration?.avg < 5 && (
                <div className="alert alert-warning">
                  <strong>⚠️ Низкая концентрация:</strong> Участнику может быть
                  трудно выполнять сложные задачи.
                </div>
              )}

              {!charts.stats.fatigue?.avg > 7 &&
                !charts.stats.heart_rate?.avg > 100 &&
                !charts.stats.concentration?.avg < 5 && (
                  <div className="alert alert-success">
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

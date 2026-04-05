import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { expeditionApi, analyticsApi, dashboardApi } from "../api/ArcticApi";
import ConcentrationChart from "../components/charts/ConcentrationChart";
import HeartRateChart from "../components/charts/HeartRateChart";
import FatigueChart from "../components/charts/FatigueChart";
import AlphaBetaThetaChart from "../components/charts/AlphaBetaThetaChart";
import RelaxChart from "../components/charts/RelaxChart";
import StressChart from "../components/charts/StressChart";

function ParticipantMetricsPage() {
  const { expeditionId, participantId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [advice, setAdvice] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [participant, setParticipant] = useState(null);
  const [expedition, setExpedition] = useState(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const loadAdvice = async () => {
    setLoadingAdvice(true);
    try {
      const indNum = participant?.user?.individualNumber;
      const data = await analyticsApi.getAdvice(expeditionId, indNum);
      setAdvice(data);
    } catch (error) {
      console.error("Failed to load advice:", error);
    } finally {
      setLoadingAdvice(false);
    }
  };

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

      const participantsData = await expeditionApi.getExpeditionParticipants(expeditionId);
      const foundParticipant = participantsData.find(
        (p) => p.participantId.toString() === participantId,
      );

      if (!foundParticipant) {
        throw new Error("Участник не найден");
      }

      setParticipant(foundParticipant);

      const indNum = foundParticipant.user.individualNumber;

      if (indNum) {
        const dashboard = await dashboardApi.getDashboardData(indNum, expeditionId);
        setDashboardData(dashboard);
      }

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

  if (!participant || !dashboardData) {
    return (
      <div className="participant-metrics__error">
        <div className="participant-metrics__error-content">
          <h4 className="participant-metrics__error-title">Ошибка</h4>
          <p className="participant-metrics__error-message">
            Участник не найден или нет данных
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

  const labels = dashboardData.map(row => `${row.date} ${row.timeOfDay}`);

  const concentrationData = { labels, values: dashboardData.map(row => row.concentration) };
  const heartRateData = { labels, values: dashboardData.map(row => row.heartRate) };
  const fatigueData = { labels, values: dashboardData.map(row => row.fatigue) };
  const alphaBetaThetaData = {
    labels,
    alpha: dashboardData.map(row => row.alpha),
    beta: dashboardData.map(row => row.beta),
    theta: dashboardData.map(row => row.theta),
    smr: dashboardData.map(row => row.smr)
  };
  const relaxData = { labels, values: dashboardData.map(row => row.relax) };
  const stressData = { labels, values: dashboardData.map(row => row.stress) };

  return (
    <div className="participant-metrics">
      <div className="participant-metrics__header">
        <button onClick={handleBack} className="participant-metrics__back-button">
          ← Назад к экспедиции
        </button>
        <div className="participant-metrics__title-wrapper">
          <h2 className="participant-metrics__title">📊 Метрики участника</h2>
          {expedition && (
            <p className="participant-metrics__subtitle">
              Экспедиция: {expedition.name} | Участник:{" "}
              {participant.user.firstName} {participant.user.lastName}
            </p>
          )}
        </div>
      </div>

      <div className="participant-metrics__info-card">
        <div className="participant-metrics__info-header">
          <h5 className="participant-metrics__info-title">👤 Информация об участнике</h5>
        </div>
        <div className="participant-metrics__info-body">
          <div className="participant-metrics__info-row">
            <div className="participant-metrics__info-col">
              <p className="participant-metrics__info-text">
                <strong>Имя:</strong> {participant.user.firstName} {participant.user.lastName}
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

      <div className="participant-metrics__charts">
        {concentrationData && (
          <div className="participant-metrics__chart-section">
            <div className="participant-metrics__chart-header">
              <h3>🎯 Концентрация</h3>
              <p className="participant-metrics__chart-subtitle">Динамика концентрации по времени</p>
            </div>
            <ConcentrationChart data={concentrationData} />
          </div>
        )}

        {heartRateData && (
          <div className="participant-metrics__chart-section">
            <div className="participant-metrics__chart-header">
              <h3>❤️ Частота сердечных сокращений</h3>
              <p className="participant-metrics__chart-subtitle">Динамика ЧСС по времени</p>
            </div>
            <HeartRateChart data={heartRateData} />
          </div>
        )}

        {fatigueData && (
          <div className="participant-metrics__chart-section">
            <div className="participant-metrics__chart-header">
              <h3>😴 Усталость</h3>
              <p className="participant-metrics__chart-subtitle">Динамика усталости по времени</p>
            </div>
            <FatigueChart data={fatigueData} />
          </div>
        )}

        {alphaBetaThetaData && (
          <div className="participant-metrics__chart-section">
            <div className="participant-metrics__chart-header">
              <h3>🧠 Мозговая активность</h3>
              <p className="participant-metrics__chart-subtitle">
                Alpha (расслабление) · Beta (активность) · Theta (дремота) · SMR (фокус)
              </p>
            </div>
            <AlphaBetaThetaChart data={alphaBetaThetaData} />
          </div>
        )}

        {relaxData && (
          <div className="participant-metrics__chart-section">
            <div className="participant-metrics__chart-header">
              <h3>🧘 Расслабление</h3>
              <p className="participant-metrics__chart-subtitle">Динамика расслабления по времени</p>
            </div>
            <RelaxChart data={relaxData} />
          </div>
        )}

        {stressData && (
          <div className="participant-metrics__chart-section">
            <div className="participant-metrics__chart-header">
              <h3>⚠️ Стресс</h3>
              <p className="participant-metrics__chart-subtitle">Динамика уровня стресса</p>
            </div>
            <StressChart data={stressData} />
          </div>
        )}
      </div>

      <div className="participant-metrics__advice-section">
        <button 
          onClick={loadAdvice} 
          disabled={loadingAdvice}
          className="participant-metrics__advice-button"
        >
          {loadingAdvice ? "⏳ Нейросеть думает..." : "🧠 Получить анализ от нейросети"}
        </button>
        
        {advice && (
          <div className="participant-metrics__recommendations">
            <div className="participant-metrics__recommendations-header">
              <h5 className="participant-metrics__recommendations-title">
                💡 Совет от нейросети
              </h5>
            </div>
            <div className="participant-metrics__recommendations-body">
              <div className="participant-metrics__alert--info">
                {advice.response}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ParticipantMetricsPage;
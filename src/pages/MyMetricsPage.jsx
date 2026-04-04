import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { expeditionApi, analyticsApi, dashboardApi } from "../api/ArcticApi";
import ConcentrationChart from "../components/charts/ConcentrationChart";
import HeartRateChart from "../components/charts/HeartRateChart";
import FatigueChart from "../components/charts/FatigueChart";
import AlphaBetaThetaChart from "../components/charts/AlphaBetaThetaChart";
import RelaxChart from "../components/charts/RelaxChart";
import StressChart from "../components/charts/StressChart";
import GravityChart from "../components/charts/GravityChart";
import NFBChart from "../components/charts/NFBChart";
import PsychologicalFatigueChart from "../components/charts/PsychologicalFatigueChart";

function MyMetricsPage() {
  const { expeditionId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [advice, setAdvice] = useState(null);
  const [expeditionData, setExpeditionData] = useState(null);
  const [expedition, setExpedition] = useState(null);

  useEffect(() => {
    loadData();
  }, [expeditionId]);

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

      const expData = await expeditionApi.getExpeditionDetails(expeditionId);
      setExpeditionData(expData);

      const indNum = localStorage.getItem("individualNumber");

      if (indNum) {
        const dashboard = await dashboardApi.getDashboardData(indNum, expeditionId);
        setDashboardData(dashboard);

        const adviceData = await analyticsApi.getAdvice(expeditionId, indNum);
        setAdvice(adviceData);
      }

      setLoading(false);
    } catch (error) {
      console.error("Failed to load metrics:", error);
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/expeditions/${expeditionId}`);
  };

  if (loading || !dashboardData) {
    return (
      <div className="metrics__spinner">
        <div className="metrics__spinner-status" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="metrics__spinner-text">Загружаем ваши метрики...</p>
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
    theta: dashboardData.map(row => row.theta)
  };
  const relaxData = { labels, values: dashboardData.map(row => row.relax) };
  const stressData = { labels, values: dashboardData.map(row => row.stress) };
  const gravityData = { labels, values: dashboardData.map(row => row.gravity) };
  const nfbData = { labels, values: dashboardData.map(row => row.smr) };
  const psychologicalFatigueData = { labels, values: dashboardData.map(row => row.fatigue) };

  return (
    <div className="metrics">
      <div className="metrics__header">
        <button onClick={handleBack} className="metrics__back-button">
          ← Назад к экспедиции
        </button>
        <div>
          <h2 className="metrics__title">📊 Мои метрики</h2>
          {expedition && (
            <p className="metrics__subtitle">Экспедиция: {expedition.name}</p>
          )}
        </div>
      </div>

      {concentrationData && (
        <div className="metrics__chart-section">
          <div className="metrics__chart-header">
            <h3>🎯 Концентрация</h3>
            <p className="metrics__chart-subtitle">Динамика концентрации по времени</p>
          </div>
          <ConcentrationChart data={concentrationData} />
        </div>
      )}

      {heartRateData && (
        <div className="metrics__chart-section">
          <div className="metrics__chart-header">
            <h3>❤️ Частота сердечных сокращений</h3>
            <p className="metrics__chart-subtitle">Динамика ЧСС по времени</p>
          </div>
          <HeartRateChart data={heartRateData} />
        </div>
      )}

      {fatigueData && (
        <div className="metrics__chart-section">
          <div className="metrics__chart-header">
            <h3>😴 Усталость</h3>
            <p className="metrics__chart-subtitle">Динамика усталости по времени</p>
          </div>
          <FatigueChart data={fatigueData} />
        </div>
      )}

      {alphaBetaThetaData && (
        <div className="metrics__chart-section">
          <div className="metrics__chart-header">
            <h3>🧠 Альфа-Бета-Тета волны</h3>
            <p className="metrics__chart-subtitle">Динамика мозговой активности</p>
          </div>
          <AlphaBetaThetaChart data={alphaBetaThetaData} />
        </div>
      )}

      {relaxData && (
        <div className="metrics__chart-section">
          <div className="metrics__chart-header">
            <h3>🧘 Расслабление</h3>
            <p className="metrics__chart-subtitle">Динамика расслабления по времени</p>
          </div>
          <RelaxChart data={relaxData} />
        </div>
      )}

      {stressData && (
        <div className="metrics__chart-section">
          <div className="metrics__chart-header">
            <h3>⚠️ Стресс</h3>
            <p className="metrics__chart-subtitle">Динамика уровня стресса</p>
          </div>
          <StressChart data={stressData} />
        </div>
      )}

      {gravityData && (
        <div className="metrics__chart-section">
          <div className="metrics__chart-header">
            <h3>⚖️ Gravity</h3>
            <p className="metrics__chart-subtitle">Динамика гравитационного фактора</p>
          </div>
          <GravityChart data={gravityData} />
        </div>
      )}

      {nfbData && (
        <div className="metrics__chart-section">
          <div className="metrics__chart-header">
            <h3>🤖 NFB</h3>
            <p className="metrics__chart-subtitle">Сенсомоторный ритм (SMR)</p>
          </div>
          <NFBChart data={nfbData} />
        </div>
      )}

      {psychologicalFatigueData && (
        <div className="metrics__chart-section">
          <div className="metrics__chart-header">
            <h3>🧠 Психологическая усталость</h3>
            <p className="metrics__chart-subtitle">Динамика психологической усталости</p>
          </div>
          <PsychologicalFatigueChart data={psychologicalFatigueData} />
        </div>
      )}

      {expeditionData && (
        <div className="metrics__info">
          <div className="metrics__info-row">
            <div className="metrics__info-column">
              <h6 className="metrics__info-label">👤 Участник:</h6>
              <p className="metrics__info-value">
                {localStorage.getItem("userEmail")}
              </p>
            </div>
            <div className="metrics__info-column">
              <h6 className="metrics__info-label">📅 Период:</h6>
              <p className="metrics__info-value">
                {expeditionData.startDate + " - " + expeditionData.endDate || "Не указано"}
              </p>
            </div>
          </div>
        </div>
      )}

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
  );
}

export default MyMetricsPage; 
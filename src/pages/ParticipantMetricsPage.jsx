import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { expeditionApi, analyticsApi, dashboardApi } from "../api/ArcticApi";
import AlphaBetaThetaChart from "../components/charts/AlphaBetaThetaChart";
import MetricDescription from "../components/MetricDescription";
import BrainWaveDistributionChart from "../components/charts/BrainWaveDistributionChart";
import FatigueModulesChart from "../components/charts/FatigueModulesChart";
import EmotionalRawMetricsChart from "../components/charts/EmotionalRawMetricsChart";
import ObjectiveVsSubjectiveChart from "../components/charts/ObjectiveVsSubjectiveChart";
import ProductivityChart from "../components/charts/ProductivityChart";
import TotalIndexGaugeChart from "../components/charts/TotalIndexGaugeChart";
import FatigueRadarChart from "../components/charts/FatigueRadarChart";
import TotalIndexTrendChart from "../components/charts/TotalIndexTrendChart";
import ObjectiveCognitiveBarChart from "../components/charts/ObjectiveCognitiveBarChart";

function ParticipantMetricsPage() {
  const { expeditionId, participantId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [advice, setAdvice] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [participant, setParticipant] = useState(null);
  const [expedition, setExpedition] = useState(null);
  const [expeditionData, setExpeditionData] = useState(null);
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

      const expData = await expeditionApi.getExpeditionDetails(expeditionId);
      setExpeditionData(expData);

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

  if (loading || !dashboardData) {
    return (
      <div className="metrics__spinner">
        <div className="metrics__spinner-status" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="metrics__spinner-text">Загружаем метрики участника...</p>
      </div>
    );
  }

  const sessions = dashboardData;
  const lastSession = sessions[sessions.length - 1];

  const labels = sessions.map(s => `${s.date} ${s.timeOfDay}`);
  const alphaBetaThetaData = {
    labels,
    alpha: sessions.map(s => s.alpha || 0),
    beta: sessions.map(s => s.beta || 0),
    theta: sessions.map(s => s.theta || 0),
    smr: sessions.map(s => s.smr || 0)
  };





  return (
    <div className="metrics">
      <div className="metrics__header">
        <button onClick={handleBack} className="metrics__back-button">
          ← Назад к экспедиции
        </button>
        <div>
          <h2 className="metrics__title">Метрики участника</h2>
          {expedition && (
            <p className="metrics__subtitle">
              Экспедиция: {expedition.name} | Участник: {participant?.user?.firstName} {participant?.user?.lastName}
            </p>
          )}
        </div>
      </div>

      <div className="metrics__participant-card">
        <div className="metrics__participant-header">
          <div className="metrics__participant-icon"></div>
          <h3>Информация об участнике</h3>
        </div>
        <div className="metrics__participant-body">
          <div className="metrics__participant-grid">
            <div className="metrics__participant-item">
              <span className="metrics__participant-label">Имя</span>
              <span className="metrics__participant-value">
                {participant?.user?.firstName} {participant?.user?.lastName}
              </span>
            </div>
            <div className="metrics__participant-item">
              <span className="metrics__participant-label">Email</span>
              <span className="metrics__participant-value">
                {participant?.user?.email || "Не указан"}
              </span>
            </div>
            <div className="metrics__participant-item">
              <span className="metrics__participant-label">Индивидуальный номер</span>
              <code className="metrics__participant-code">
                {participant?.user?.individualNumber || "Не указан"}
              </code>
            </div>
            {expeditionData && (
              <>
                <div className="metrics__participant-item">
                  <span className="metrics__participant-label">Период экспедиции</span>
                  <span className="metrics__participant-value">
                    {expeditionData.startDate} — {expeditionData.endDate}
                  </span>
                </div>
                <div className="metrics__participant-item">
                  <span className="metrics__participant-label">Экспедиция</span>
                  <span className="metrics__participant-value">
                    {expedition?.name}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>



      <div className="metrics__chart-section">
        <div className="metrics__chart-header">
          <h3>Мозговая активность</h3>
          <p className="metrics__chart-subtitle">
            Alpha (расслабление) · Beta (активность) · Theta (дремота) · SMR (фокус)
          </p>
        </div>
        <AlphaBetaThetaChart sessions={sessions} />
        </div>

      <div className="metrics__chart-section">
        <div className="metrics__chart-header">
          <h3>Распределение мозговых волн</h3>
          <p className="metrics__chart-subtitle">
            Текущее соотношение Alpha, Beta, Theta и SMR (последний замер)
          </p>
        </div>
        <BrainWaveDistributionChart sessions={sessions} />
      </div>

      <div className="metrics__chart-section">
        <div className="metrics__chart-header">
          <h3>Динамика усталости</h3>
          <p className="metrics__chart-subtitle">
            Когнитивная, физиологическая и психологическая усталость по сессиям
          </p>
        </div>
        <FatigueModulesChart sessions={sessions} />
      </div>

      <div className="metrics__chart-section">
        <div className="metrics__chart-header">
          <h3>Эмоциональные показатели</h3>
          <p className="metrics__chart-subtitle">
            Внимание, когнитивная нагрузка, самоконтроль и когнитивный контроль
          </p>
        </div>
        <EmotionalRawMetricsChart sessions={sessions} />
      </div>

      <div className="metrics__chart-section">
        <div className="metrics__chart-header">
          <h3>Продуктивность</h3>
          <p className="metrics__chart-subtitle">
            Динамика продуктивности по сессиям
          </p>
        </div>
        <ProductivityChart sessions={sessions} />
      </div>

      <div className="metrics__chart-section">
        <div className="metrics__chart-header">
          <h3>Объективная vs Субъективная оценка</h3>
          <p className="metrics__chart-subtitle">
            Сравнение реальных и самооценённых показателей (последняя сессия)
          </p>
        </div>
        <ObjectiveVsSubjectiveChart session={lastSession} />
      </div>

      <div className="metrics__chart-section">
        <div className="metrics__chart-header">
          <h3>Общий индекс состояния</h3>
          <p className="metrics__chart-subtitle">
            Текущее общее состояние (последняя сессия)
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <TotalIndexGaugeChart session={lastSession} />
        </div>
      </div>


      <div className="metrics__chart-section">
        <div className="metrics__chart-header">
          <h3>Тренд общего индекса</h3>
          <p className="metrics__chart-subtitle">
            Динамика общего состояния по сессиям
          </p>
        </div>
        <TotalIndexTrendChart sessions={sessions} />
      </div>

      <div className="metrics__chart-section">
        <div className="metrics__chart-header">
          <h3>Объективные оценки по сессиям</h3>
          <p className="metrics__chart-subtitle">
            Когнитивная, физиологическая и психологическая оценки
          </p>
        </div>
        <ObjectiveCognitiveBarChart sessions={sessions} />
      </div>


      <div className="metrics__advice-section">
        <button 
          onClick={loadAdvice} 
          disabled={loadingAdvice}
          className="metrics__advice-button"
        >
          {loadingAdvice ? "⏳ Нейросеть думает..." : "🧠 Получить анализ от нейросети"}
        </button>
        
        {advice && (
          <div className="metrics__recommendations">
            <div className="metrics__recommendations-header">
              <h5>💡 Анализ и рекомендации</h5>
            </div>
            <div className="metrics__recommendations-body">
              <div className="metrics__alert--info">
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
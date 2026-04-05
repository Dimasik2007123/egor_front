import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { expeditionApi, analyticsApi, dashboardApi } from "../api/ArcticApi";
import ConcentrationChart from "../components/charts/ConcentrationChart";
import HeartRateChart from "../components/charts/HeartRateChart";
import FatigueChart from "../components/charts/FatigueChart";
import AlphaBetaThetaChart from "../components/charts/AlphaBetaThetaChart";
import RelaxChart from "../components/charts/RelaxChart";
import StressChart from "../components/charts/StressChart";
import MetricDescription from "../components/MetricDescription";
import BrainWaveDistributionChart from "../components/charts/BrainWaveDistributionChart";
import RadarPerformanceChart from "../components/charts/RadarPerformanceChart";
import BarComparisonChart from "../components/charts/BarComparisonChart";
import MultiAxisChart from "../components/charts/MultiAxisChart";

function MyMetricsPage() {
  const { expeditionId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [advice, setAdvice] = useState(null);
  const [expeditionData, setExpeditionData] = useState(null);
  const [expedition, setExpedition] = useState(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const loadAdvice = async () => {
    setLoadingAdvice(true);
    try {
      const indNum = localStorage.getItem("individualNumber");
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
    theta: dashboardData.map(row => row.theta),
    smr: dashboardData.map(row => row.smr)
  };
  const relaxData = { labels, values: dashboardData.map(row => row.relax) };
  const stressData = { labels, values: dashboardData.map(row => row.stressIndex) };

  const lastRow = dashboardData[dashboardData.length - 1];
  const brainWaveDistributionData = {
    alpha: lastRow?.alpha || 0,
    beta: lastRow?.beta || 0,
    theta: lastRow?.theta || 0,
    smr: lastRow?.smr || 0,
  };

  const avgConcentration = dashboardData.reduce((sum, row) => sum + row.concentration, 0) / dashboardData.length;
  const avgRelax = dashboardData.reduce((sum, row) => sum + row.relax, 0) / dashboardData.length;
  const avgStress = dashboardData.reduce((sum, row) => sum + row.stressIndex, 0) / dashboardData.length;
  const avgFatigue = dashboardData.reduce((sum, row) => sum + row.fatigue, 0) / dashboardData.length;
  
  const radarData = {
    concentration: avgConcentration,
    relax: avgRelax,
    stress: avgStress,
    fatigue: avgFatigue,
    psychologicalFatigue: avgFatigue * 0.8,
  };

  const daysLabels = dashboardData.map((row, index) => `Сессия ${index + 1}`);
  const barComparisonData = {
    labels: daysLabels,
    concentration: dashboardData.map(row => row.concentration),
    relax: dashboardData.map(row => row.relax),
    stress: dashboardData.map(row => row.stressIndex),
  };

  const multiAxisData = {
    labels: labels,
    concentration: dashboardData.map(row => row.concentration),
    heartRate: dashboardData.map(row => row.heartRate),
  };

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

      <div className="metrics__participant-card">
        <div className="metrics__participant-header">
          <div className="metrics__participant-icon">👤</div>
          <h3>Информация об участнике</h3>
        </div>
        <div className="metrics__participant-body">
          <div className="metrics__participant-grid">
            <div className="metrics__participant-item">
              <span className="metrics__participant-label">Email</span>
              <span className="metrics__participant-value">
                {localStorage.getItem("userEmail") || "Не указан"}
              </span>
            </div>
            <div className="metrics__participant-item">
              <span className="metrics__participant-label">Индивидуальный номер</span>
              <code className="metrics__participant-code">
                {localStorage.getItem("individualNumber") || "Не указан"}
              </code>
            </div>
            {expeditionData && (
              <>
                <div className="metrics__participant-item">
                  <span className="metrics__participant-label">📅 Период экспедиции</span>
                  <span className="metrics__participant-value">
                    {expeditionData.startDate} — {expeditionData.endDate}
                  </span>
                </div>
                <div className="metrics__participant-item">
                  <span className="metrics__participant-label">🏔️ Экспедиция</span>
                  <span className="metrics__participant-value">
                    {expedition?.name}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="metrics__descriptions">
        <MetricDescription 
          title="Мозговая активность"
          icon="🧠"
          description="Alpha (8-12 Гц) — расслабление, спокойное состояние. Beta (12-30 Гц) — активность, концентрация. Theta (4-8 Гц) — дремота, творчество. SMR (12-15 Гц) — фокус при расслабленном теле."
        />
        <MetricDescription 
          title="ЧСС"
          icon="❤️"
          description="Частота сердечных сокращений. Норма в покое: 60-80 уд/мин. Повышение может указывать на стресс или физическую нагрузку."
        />
        <MetricDescription 
          title="Усталость"
          icon="😴"
          description="Уровень физического утомления. Высокие значения (>70%) сигнализируют о необходимости отдыха."
        />
        <MetricDescription 
          title="Стресс"
          icon="⚠️"
          description="Индекс стресса. Повышенные значения требуют внимания и восстановления."
        />
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
            <h3>🧠 Мозговая активность</h3>
            <p className="metrics__chart-subtitle">
              Alpha (расслабление) · Beta (активность) · Theta (дремота) · SMR (фокус)
            </p>
          </div>
          <AlphaBetaThetaChart data={alphaBetaThetaData} />
        </div>
      )}

      {brainWaveDistributionData && (
        <div className="metrics__chart-section">
          <div className="metrics__chart-header">
            <h3>🥧 Распределение мозговых волн</h3>
            <p className="metrics__chart-subtitle">
              Текущее соотношение Alpha, Beta, Theta и SMR (последний замер)
            </p>
          </div>
          <BrainWaveDistributionChart data={brainWaveDistributionData} />
        </div>
      )}

      {radarData && (
        <div className="metrics__chart-section">
          <div className="metrics__chart-header">
            <h3>📡 Общий профиль состояния</h3>
            <p className="metrics__chart-subtitle">
              Усредненные показатели за всю экспедицию
            </p>
          </div>
          <RadarPerformanceChart data={radarData} />
        </div>
      )}

      {barComparisonData && (
        <div className="metrics__chart-section">
          <div className="metrics__chart-header">
            <h3>📊 Сравнение показателей по сессиям</h3>
            <p className="metrics__chart-subtitle">
              Концентрация, расслабление и стресс в каждом замере
            </p>
          </div>
          <BarComparisonChart data={barComparisonData} />
        </div>
      )}

      {multiAxisData && (
        <div className="metrics__chart-section">
          <div className="metrics__chart-header">
            <h3>📈 Концентрация и ЧСС</h3>
            <p className="metrics__chart-subtitle">
              Сравнение динамики концентрации и частоты сердечных сокращений
            </p>
          </div>
          <MultiAxisChart data={multiAxisData} />
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

export default MyMetricsPage;
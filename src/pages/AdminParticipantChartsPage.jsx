import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dashboardApi, analyticsApi } from "../api/ArcticApi";
import AlphaBetaThetaChart from "../components/charts/AlphaBetaThetaChart";
import BrainWaveDistributionChart from "../components/charts/BrainWaveDistributionChart";
import FatigueModulesChart from "../components/charts/FatigueModulesChart";
import EmotionalRawMetricsChart from "../components/charts/EmotionalRawMetricsChart";
import ObjectiveVsSubjectiveChart from "../components/charts/ObjectiveVsSubjectiveChart";
import ProductivityChart from "../components/charts/ProductivityChart";
import TotalIndexGaugeChart from "../components/charts/TotalIndexGaugeChart";
import FatigueRadarChart from "../components/charts/FatigueRadarChart";
import TotalIndexTrendChart from "../components/charts/TotalIndexTrendChart";
import ObjectiveCognitiveBarChart from "../components/charts/ObjectiveCognitiveBarChart";

function AdminParticipantChartsPage() {
  const { expeditionId, indNum } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeChart, setActiveChart] = useState("alphaBetaTheta");
  const [advice, setAdvice] = useState(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const loadAdvice = async () => {
    setLoadingAdvice(true);
    try {
      const data = await analyticsApi.getAdvice(expeditionId, indNum);
      setAdvice(data);
    } catch (error) {
      console.error("Failed to load advice:", error);
    } finally {
      setLoadingAdvice(false);
    }
  };

  useEffect(() => {
    if (indNum) {
      const loadData = async () => {
        try {
          const data = await dashboardApi.getDashboardData(indNum, expeditionId);
          setDashboardData(data);
          setLoading(false);
        } catch {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [expeditionId, indNum]);

  const chartTypes = [
    { key: "alphaBetaTheta", label: "Мозговая активность", component: AlphaBetaThetaChart },
    { key: "brainWaveDistribution", label: "Распределение волн", component: BrainWaveDistributionChart },
    { key: "fatigueModules", label: "Динамика усталости", component: FatigueModulesChart },
    { key: "emotional", label: "Эмоциональные показатели", component: EmotionalRawMetricsChart },
    { key: "productivity", label: "Продуктивность", component: ProductivityChart },
    { key: "objectiveVsSubjective", label: "Объективная vs Субъективная", component: ObjectiveVsSubjectiveChart },
    { key: "totalIndexGauge", label: "Общий индекс", component: TotalIndexGaugeChart },
    { key: "totalIndexTrend", label: "Тренд индекса", component: TotalIndexTrendChart },
    { key: "objectiveCognitive", label: "Объективные оценки", component: ObjectiveCognitiveBarChart },
  ];

  const handleBack = () => {
    navigate(`/admin/expeditions/${expeditionId}/members`);
  };

  if (loading) {
    return <div className="charts__loading-message">Загрузка графиков...</div>;
  }

  if (!dashboardData) {
    return <div className="charts__empty-message">Нет данных</div>;
  }

  const sessions = dashboardData;
  const lastSession = sessions[sessions.length - 1];
  const labels = sessions.map(s => `${s.date} ${s.timeOfDay}`);

  const chartDataMap = {
    alphaBetaTheta: {
      labels,
      alpha: sessions.map(s => s.alpha || 0),
      beta: sessions.map(s => s.beta || 0),
      theta: sessions.map(s => s.theta || 0),
      smr: sessions.map(s => s.smr || 0)
    },
    brainWaveDistribution: {
      alpha: lastSession?.alpha || 0,
      beta: lastSession?.beta || 0,
      theta: lastSession?.theta || 0,
      smr: lastSession?.smr || 0,
    },
    fatigueModules: { sessions },
    emotional: { sessions },
    productivity: { sessions },
    objectiveVsSubjective: { session: lastSession },
    totalIndexGauge: { session: lastSession },
    fatigueRadar: { session: lastSession },
    totalIndexTrend: { sessions },
    objectiveCognitive: { sessions },
  };

  const ActiveChartComponent = chartTypes.find(c => c.key === activeChart)?.component;

  return (
    <div className="charts">
      <button onClick={handleBack} className="charts__button">
        ← Назад к участникам
      </button>

      <div className="charts__card">
        <div className="charts__card-header">
          <ul className="charts__nav">
            {chartTypes.map((chart) => (
              <li key={chart.key} className="charts__nav-item">
                <button
                  className={`charts__nav-link ${activeChart === chart.key ? "charts__nav-link--active" : ""}`}
                  onClick={() => setActiveChart(chart.key)}
                >
                  {chart.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="charts__card-body">
          {ActiveChartComponent && (
            <ActiveChartComponent {...chartDataMap[activeChart]} />
          )}
        </div>
      </div>

      <div className="charts__advice-section">
        <button onClick={loadAdvice} disabled={loadingAdvice} className="charts__advice-button">
          {loadingAdvice ? "⏳ Нейросеть думает..." : "🧠 Получить анализ от нейросети"}
        </button>
        {advice && (
          <div className="charts__recommendations">
            <div className="charts__recommendations-header"><h5>💡 Анализ и рекомендации</h5></div>
            <div className="charts__recommendations-body"><div className="charts__alert--info">{advice.response}</div></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminParticipantChartsPage;
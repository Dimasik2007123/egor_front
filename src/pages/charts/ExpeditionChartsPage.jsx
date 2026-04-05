import { useState, useEffect } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { dashboardApi, analyticsApi } from "../../api/ArcticApi";
import ConcentrationChart from "../../components/charts/ConcentrationChart";
import HeartRateChart from "../../components/charts/HeartRateChart";
import FatigueChart from "../../components/charts/FatigueChart";
import AlphaBetaThetaChart from "../../components/charts/AlphaBetaThetaChart";
import RelaxChart from "../../components/charts/RelaxChart";
import StressChart from "../../components/charts/StressChart";

function ExpeditionChartsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const indNum = searchParams.get("indNum");

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeChart, setActiveChart] = useState("concentration");
  const [advice, setAdvice] = useState(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const loadAdvice = async () => {
    setLoadingAdvice(true);
    try {
      const data = await analyticsApi.getAdvice(id, indNum);
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
          const data = await dashboardApi.getDashboardData(indNum, id);
          setDashboardData(data);
          setLoading(false);
        } catch {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [id, indNum]);

  const chartTypes = [
    { key: "concentration", label: "🎯 Концентрация", component: ConcentrationChart },
    { key: "heartRate", label: "❤️ ЧСС", component: HeartRateChart },
    { key: "fatigue", label: "😴 Усталость", component: FatigueChart },
    { key: "alphaBetaTheta", label: "🧠 Мозговая активность", component: AlphaBetaThetaChart },
    { key: "relax", label: "🧘 Расслабление", component: RelaxChart },
    { key: "stress", label: "⚠️ Стресс", component: StressChart },
  ];

  if (loading) {
    return <div className="charts__loading-message">Загрузка графиков...</div>;
  }

  if (!dashboardData) {
    return <div className="charts__empty-message">Нет данных</div>;
  }

  const labels = dashboardData.map(row => `${row.date} ${row.timeOfDay}`);
  
  const chartDataMap = {
    concentration: { labels, values: dashboardData.map(row => row.concentration) },
    heartRate: { labels, values: dashboardData.map(row => row.heartRate) },
    fatigue: { labels, values: dashboardData.map(row => row.fatigue) },
    alphaBetaTheta: {
      labels,
      alpha: dashboardData.map(row => row.alpha),
      beta: dashboardData.map(row => row.beta),
      theta: dashboardData.map(row => row.theta),
      smr: dashboardData.map(row => row.smr)
    },
    relax: { labels, values: dashboardData.map(row => row.relax) },
    stress: { labels, values: dashboardData.map(row => row.stress) },
  };

  const ActiveChartComponent = chartTypes.find(c => c.key === activeChart)?.component;

  return (
    <div className="charts">
      <button
        onClick={() => navigate(`/expeditions/${id}/participants`)}
        className="charts__button"
      >
        ← Выбрать другого участника
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
            <ActiveChartComponent data={chartDataMap[activeChart]} />
          )}
        </div>
      </div>

      <div className="charts__advice-section">
        <button 
          onClick={loadAdvice} 
          disabled={loadingAdvice}
          className="charts__advice-button"
        >
          {loadingAdvice ? "⏳ Нейросеть думает..." : "🧠 Получить анализ от нейросети"}
        </button>
        
        {advice && (
          <div className="charts__recommendations">
            <div className="charts__recommendations-header">
              <h5>💡 Анализ и рекомендации</h5>
            </div>
            <div className="charts__recommendations-body">
              <div className="charts__alert--info">
                {advice.response}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpeditionChartsPage;
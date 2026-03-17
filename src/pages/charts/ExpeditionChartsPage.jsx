import { useState, useEffect } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
//import axios from 'axios';
import { chartsApi } from "../../api/ArcticApi";

function ExpeditionChartsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const indNum = searchParams.get("indNum");

  const [chartUrls, setChartUrls] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState("heart-rate");

  useEffect(() => {
    if (indNum) {
      const loadCharts = async () => {
        try {
          const heartRateUrl = await chartsApi.getChartImage(
            id,
            "heart-rate",
            indNum,
          );
          const fatigueUrl = await chartsApi.getChartImage(
            id,
            "fatigue",
            indNum,
          );
          const alphabetathetaUrl = await chartsApi.getChartImage(
            id,
            "alpha-beta-theta",
            indNum,
          );
          const psychologicalfatigueUrl = await chartsApi.getChartImage(
            id,
            "psychological-fatigue",
            indNum,
          );
          const gravityUrl = await chartsApi.getChartImage(
            id,
            "gravity",
            indNum,
          );
          const concentrationUrl = await chartsApi.getChartImage(
            id,
            "concentration",
            indNum,
          );
          const relaxationUrl = await chartsApi.getChartImage(
            id,
            "relaxation",
            indNum,
          );
          const nlpUrl = await chartsApi.getChartImage(id, "nlp", indNum);
          setChartUrls({
            "heart-rate": heartRateUrl,
            fatigue: fatigueUrl,
            "alpha-beta-theta": alphabetathetaUrl,
            "psychological-fatigue": psychologicalfatigueUrl,
            gravity: gravityUrl,
            concentration: concentrationUrl,
            relaxation: relaxationUrl,
            nlp: nlpUrl,
          });
          setLoading(false);
        } catch {
          setLoading(false);
        }
      };
      loadCharts();
    }

    //loadCharts();
  }, [id, indNum]);

  const chartTypes = [
    { key: "heart-rate", label: "❤️ ЧСС", icon: true },
    { key: "fatigue", label: "😴 Усталость", icon: false },
    { key: "alpha-beta-theta", label: "🧠 Альфа-Бета-Тета", icon: false },
    { key: "psychological-fatigue", label: "🧠 Псих. усталость", icon: false },
    { key: "gravity", label: "📊 Гравитация", icon: false },
    { key: "concentration", label: "🎯 Концентрация", icon: false },
    { key: "relaxation", label: "🧘 Расслабление", icon: false },
    { key: "nlp", label: "🤖 NLP", icon: false },
  ];

  if (loading)
    return <div className="charts__loading-message">Загрузка графиков...</div>;

  if (Object.values(chartUrls).every((url) => !url))
    return <div className="charts__empty-message">Нет данных</div>;

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
                  onClick={() => {
                    if (chartUrls[chart.key]) {
                      setActiveChart(chart.key);
                    }
                  }}
                  disabled={!chartUrls[chart.key]}
                  title={!chartUrls[chart.key] ? "График не доступен" : ""}
                >
                  {chart.icon ? (
                    <span className="heart-icon">{chart.label}</span>
                  ) : (
                    chart.label
                  )}
                </button>
              </li>
            ))}
          </ul>
          {!chartUrls[activeChart] && (
            <div className="charts__empty-message">График не доступен</div>
          )}
        </div>
        <div className="charts__card-body">
          {chartUrls[activeChart] && (
            <img
              src={chartUrls[activeChart]}
              alt={`График ${activeChart}`}
              className="charts__card-img"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpeditionChartsPage;

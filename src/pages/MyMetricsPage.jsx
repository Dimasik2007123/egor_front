import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import axios from 'axios';
import { chartsApi, expeditionApi } from "../api/ArcticApi";

function MyMetricsPage() {
  const { expeditionId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [charts, setCharts] = useState(null);
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

      const chartsData = await chartsApi.getMyCharts(expeditionId);

      setCharts(chartsData);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load metrics:", error);
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/expeditions/${expeditionId}`);
  };

  if (loading) {
    return (
      <div className="metrics__spinner">
        <div className="metrics__spinner-status" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="metrics__spinner-text">Загружаем ваши метрики...</p>
      </div>
    );
  }

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

      <div className="metrics__charts">
        {charts?.charts?.map((chart) => {
          let title = "";
          let icon = "";

          switch (chart.chartType) {
            case "heart-rate":
              title = "Частота сердечных сокращений";
              icon = "❤️";
              break;
            case "fatigue":
              title = "Усталость";
              icon = "😴";
              break;
            case "psychological-fatigue":
              title = "Психологическая усталость";
              icon = "🧠";
              break;
            case "concentration":
              title = "Концентрация";
              icon = "🎯";
              break;
            case "alpha-beta-theta":
              title = "Альфа-Бета-Тета волны";
              icon = "🌊";
              break;
            case "gravity":
              title = "Гравитация";
              icon = "⚖️";
              break;
            case "relaxation":
              title = "Расслабление";
              icon = "🧘";
              break;
            case "nlp":
              title = "NLP анализ";
              icon = "🤖";
              break;
            default:
              title = chart.chartType;
              icon = "📊";
          }

          return (
            <div key={chart.chartType} className="metrics__charts-half">
              <div className="metrics__charts-card">
                <div className="metrics__charts-card-header">
                  <h5 className="metrics__charts-card-title">
                    {icon} {title}
                  </h5>
                </div>
                <div className="metrics__charts-card-body">
                  <img
                    src={chart.imageBase64}
                    alt={`График ${title}`}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {charts && (
        <div className="metrics__info">
          <div className="metrics__info-row">
            <div className="metrics__info-column">
              <h6 className="metrics__info-label">👤 Участник:</h6>
              <p className="metrics__info-value">
                {localStorage.getItem("userEmail") /*GGGGGGG*/}
              </p>
            </div>
            <div className="metrics__info-column">
              <h6 className="metrics__info-label">📅 Период:</h6>
              <p className="metrics__info-value">
                {charts.period || "Не указано"}
              </p>
            </div>
            <div className="metrics__info-column">
              <h6 className="metrics__info-label">📊 Измерений:</h6>
              <p className="metrics__info-value">
                {charts.total_measurements || 0}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyMetricsPage;

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import axios from 'axios';
import { chartsApi, expeditionApi, analyticsApi } from "../api/ArcticApi";

function MyMetricsPage() {
  const { expeditionId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [charts, setCharts] = useState(null);
  const [chartUrls, setChartUrls] = useState({});
  const [advice, setAdvice] = useState(null);
  const [expeditionData, setExpeditionData] = useState(null);
  const [expedition, setExpedition] = useState(null);

  const chartTypes = [
    { key: "heart-rate", label: "❤️ ЧСС", icon: true },
    { key: "fatigue", label: "😴 Усталость", icon: false },
    { key: "alpha-beta-theta", label: "🧠 Альфа-Бета-Тета", icon: false },
    { key: "psychological-fatigue", label: "🧠 Псих. усталость", icon: false },
    { key: "gravity", label: "📊 Гравитация", icon: false },
    { key: "concentration", label: "🎯 Концентрация", icon: false },
    { key: "relaxation", label: "🧘 Расслабление", icon: false },
    { key: "nfb", label: "🤖 NFB", icon: false },
  ];

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
        const results = await Promise.allSettled([
          chartsApi.getChartImage(expeditionId, "heart-rate", indNum),
          chartsApi.getChartImage(expeditionId, "fatigue", indNum),
          chartsApi.getChartImage(expeditionId, "alpha-beta-theta", indNum),
          chartsApi.getChartImage(
            expeditionId,
            "psychological-fatigue",
            indNum,
          ),
          chartsApi.getChartImage(expeditionId, "gravity", indNum),
          chartsApi.getChartImage(expeditionId, "concentration", indNum),
          chartsApi.getChartImage(expeditionId, "relaxation", indNum),
          chartsApi.getChartImage(expeditionId, "nfb", indNum),
        ]);

        setChartUrls({
          "heart-rate":
            results[0].status === "fulfilled" ? results[0].value : null,
          fatigue: results[1].status === "fulfilled" ? results[1].value : null,
          "alpha-beta-theta":
            results[2].status === "fulfilled" ? results[2].value : null,
          "psychological-fatigue":
            results[3].status === "fulfilled" ? results[3].value : null,
          gravity: results[4].status === "fulfilled" ? results[4].value : null,
          concentration:
            results[5].status === "fulfilled" ? results[5].value : null,
          relaxation:
            results[6].status === "fulfilled" ? results[6].value : null,
          nfb: results[7].status === "fulfilled" ? results[7].value : null,
        });

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
        {Object.entries(chartUrls).map(([key, url]) => {
          if (!url) return null;

          let title = "";
          let icon = "";

          switch (key) {
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
            case "nfb":
              title = "NFB анализ";
              icon = "🤖";
              break;
            default:
              title = key;
              icon = "📊";
          }

          return (
            <div key={key} className="metrics__charts-half">
              <div className="metrics__charts-card">
                <div className="metrics__charts-card-header">
                  <h5 className="metrics__charts-card-title">
                    {icon} {title}
                  </h5>
                </div>
                <div className="metrics__charts-card-body">
                  <img
                    src={url}
                    alt={`График ${title}`}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {expeditionData && (
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
                {expeditionData.startDate + " - " + expeditionData.endDate ||
                  "Не указано"}
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

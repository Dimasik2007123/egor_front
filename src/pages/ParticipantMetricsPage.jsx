import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import axios from 'axios';
import { chartsApi, expeditionApi, analyticsApi } from "../api/ArcticApi";

function ParticipantMetricsPage() {
  const { expeditionId, participantId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [charts, setCharts] = useState(null);
  const [advice, setAdvice] = useState(null);
  const [participant, setParticipant] = useState(null);
  const [expedition, setExpedition] = useState(null);

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

      const participantsData =
        await expeditionApi.getExpeditionParticipants(expeditionId);

      console.log("Participants data from API:", participantsData);

      const foundParticipant = participantsData.find(
        (p) => p.participantId.toString() === participantId,
      );

      if (!foundParticipant) {
        throw new Error("Участник не найден");
      }

      setParticipant(foundParticipant);

      const chartsData = await chartsApi.getParticipantCharts(
        expeditionId,
        foundParticipant.user.individualNumber,
      );

      setCharts(chartsData);

      const adviceData = await analyticsApi.getAdvice(
        expeditionId,
        foundParticipant.user.individualNumber,
      );
      setAdvice(adviceData);

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

  if (!participant) {
    return (
      <div className="participant-metrics__error">
        <div className="participant-metrics__error-content">
          <h4 className="participant-metrics__error-title">Ошибка</h4>
          <p className="participant-metrics__error-message">
            Участник не найден
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

  return (
    <div className="participant-metrics">
      <div className="participant-metrics__header">
        <button
          onClick={handleBack}
          className="participant-metrics__back-button"
        >
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
          <h5 className="participant-metrics__info-title">
            👤 Информация об участнике
          </h5>
        </div>
        <div className="participant-metrics__info-body">
          <div className="participant-metrics__info-row">
            <div className="participant-metrics__info-col">
              <p className="participant-metrics__info-text">
                <strong>Имя:</strong> {participant.user.firstName}{" "}
                {participant.user.lastName}
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
            case "nfb":
              title = "NFB анализ";
              icon = "🤖";
              break;
            default:
              title = chart.chartType;
              icon = "📊";
          }

          return (
            <div
              key={chart.chartType}
              className="participant-metrics__charts-half"
            >
              <div className="participant-metrics__charts-card">
                <div className="participant-metrics__charts-card-header">
                  <h5 className="participant-metrics__charts-card-title">
                    {icon} {title}
                  </h5>
                </div>
                <div className="participant-metrics__charts-card-body">
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

export default ParticipantMetricsPage;

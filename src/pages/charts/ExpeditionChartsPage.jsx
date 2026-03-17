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
          setChartUrls({
            "heart-rate": heartRateUrl,
            fatigue: fatigueUrl,
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

  if (loading)
    return <div className="charts__loading-message">Загрузка графиков...</div>;
  if (!chartUrls["heart-rate"] && !chartUrls["fatigue"])
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
            <li className="charts__nav-item">
              <button
                className={`charts__nav-link ${activeChart === "heart-rate" ? "charts__nav-link--active" : ""}`}
                onClick={() => {
                  if (chartUrls["heart-rate"]) {
                    setActiveChart("heart-rate");
                  }
                }}
                disabled={!chartUrls["heart-rate"]}
              >
                <span className="heart-icon">❤️</span> ЧСС
              </button>
            </li>
            <li className="charts__nav-item">
              <button
                className={`charts__nav-link ${activeChart === "fatigue" ? "charts__nav-link--active" : ""}`}
                onClick={() => {
                  if (chartUrls["fatigue"]) {
                    setActiveChart("fatigue");
                  }
                }}
                disabled={!chartUrls["fatigue"]}
              >
                😴 Усталость
              </button>
            </li>
          </ul>
          {!chartUrls[activeChart] && (
            <div className="charts__empty-message">График не доступен</div>
          )}
        </div>
        <div className="charts__card-body">
          {chartUrls[activeChart] && (
            <img
              src={chartUrls[activeChart]}
              alt="График"
              className="charts__card-img"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpeditionChartsPage;

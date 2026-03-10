import { useState, useEffect } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
//import axios from 'axios';
import { chartsApi } from "../../api/ArcticApi";

function ExpeditionChartsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const indNum = searchParams.get("indNum");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState("heart-rate");

  useEffect(() => {
    if (indNum) {
      chartsApi
        .getExpeditionCharts(id, indNum)
        .then((res) => {
          setData(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, indNum]);

  if (loading)
    return <div className="charts__loading-message">Загрузка графиков...</div>;
  if (!data) return <div className="charts__empty-message">Нет данных</div>;

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
                className={`charts__nav-link ${activeChart === "charts__nav-link--heart-rate" ? "charts__nav-link--active" : ""}`}
                onClick={() => setActiveChart("heart-rate")}
              >
                ❤️ ЧСС
              </button>
            </li>
            <li className="charts__nav-item">
              <button
                className={`charts__nav-link ${activeChart === "charts__nav-link--fatigue" ? "charts__nav-link--active" : ""}`}
                onClick={() => setActiveChart("fatigue")}
              >
                😴 Усталость
              </button>
            </li>
          </ul>
        </div>
        <div className="charts__card-body">
          {data[activeChart] && (
            <img
              src={data[activeChart]}
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

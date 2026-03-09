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
    return (
      <div className="container mt-5 text-center">Загрузка графиков...</div>
    );
  if (!data)
    return <div className="container mt-5 text-center">Нет данных</div>;

  return (
    <div className="container mt-4">
      <button
        onClick={() => navigate(`/expeditions/${id}/participants`)}
        className="btn btn-outline-secondary mb-3"
      >
        ← Выбрать другого участника
      </button>

      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeChart === "heart-rate" ? "active" : ""}`}
                onClick={() => setActiveChart("heart-rate")}
              >
                ❤️ ЧСС
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeChart === "fatigue" ? "active" : ""}`}
                onClick={() => setActiveChart("fatigue")}
              >
                😴 Усталость
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {data[activeChart] && (
            <img
              src={data[activeChart]}
              alt="График"
              className="img-fluid"
              style={{ maxHeight: "500px" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpeditionChartsPage;

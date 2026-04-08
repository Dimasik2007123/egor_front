import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { expeditionApi } from "../api/ArcticApi";

function AdminExpeditionsPage() {
  const navigate = useNavigate();
  const [expeditions, setExpeditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    loadExpeditions();
  }, [currentPage, pageSize]);

  const loadExpeditions = async () => {
    setLoading(true);
    try {
      const data = await expeditionApi.getAllExpeditionsPaginated(
        currentPage, 
        pageSize, 
        "id", 
        "desc"
      );
      setExpeditions(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Failed to load expeditions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMembers = (expeditionId) => {
    navigate(`/admin/expeditions/${expeditionId}/members`);
  };

  const handleBack = () => {
    navigate("/admin");
  };

  if (loading) {
    return <div className="admin-spinner">Загрузка экспедиций...</div>;
  }

  return (
    <div className="admin-expeditions">
      <div className="admin-header">
        <button onClick={handleBack} className="back-button">← Назад в админ-панель</button>
        <h1>Все экспедиции</h1>
        <p>Всего экспедиций: {totalElements}</p>
      </div>

      <div className="admin__page-size">
        <label>Показывать: </label>
        <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="expeditions-grid">
        {expeditions.map(exp => (
          <div key={exp.id} className="expedition-card">
            <h3>{exp.name}</h3>
            <p className="expedition-description">{exp.description?.substring(0, 100)}{exp.description?.length > 100 ? "..." : ""}</p>
            <div className="expedition-dates">
              Период: {exp.startDate?.split("T")[0]} — {exp.endDate?.split("T")[0]}
            </div>
            <button onClick={() => handleViewMembers(exp.id)} className="view-members-btn">
              Участники
            </button>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="admin__pagination">
          <button onClick={() => setCurrentPage(0)} disabled={currentPage === 0}>««</button>
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0}>«</button>
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            let pageNum;
            if (totalPages <= 5) pageNum = i;
            else if (currentPage < 2) pageNum = i;
            else if (currentPage > totalPages - 3) pageNum = totalPages - 5 + i;
            else pageNum = currentPage - 2 + i;
            return <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={currentPage === pageNum ? "active" : ""}>{pageNum + 1}</button>;
          })}
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= totalPages - 1}>»</button>
          <button onClick={() => setCurrentPage(totalPages - 1)} disabled={currentPage >= totalPages - 1}>»»</button>
        </div>
      )}
    </div>
  );
}

export default AdminExpeditionsPage;
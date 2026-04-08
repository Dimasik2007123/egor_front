import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { expeditionApi } from "../api/ArcticApi";

function AdminExpeditionMembersPage() {
  const { expeditionId } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [expedition, setExpedition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [expeditionId]);

  const loadData = async () => {
    try {
      const expData = await expeditionApi.getExpeditionDetails(expeditionId);
      setExpedition(expData);
      
      const membersData = await expeditionApi.getExpeditionParticipants(expeditionId);
      setMembers(membersData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberClick = (member) => {
    navigate(`/admin/expeditions/${expeditionId}/charts/${member.user.individualNumber}`);
  };

  const handleBack = () => {
    navigate("/admin/expeditions");
  };

  if (loading) {
    return <div className="admin-spinner">Загрузка участников...</div>;
  }

  return (
    <div className="admin-expedition-members">
      <div className="admin-header">
        <button onClick={handleBack} className="back-button">← Назад к экспедициям</button>
        <h1>Участники экспедиции</h1>
        <h2>{expedition?.name}</h2>
      </div>

      <div className="members-grid">
        {members.length === 0 ? (
          <p>В этой экспедиции пока нет участников</p>
        ) : (
          members.map((member) => (
            <div key={member.participantId} className="member-card" onClick={() => handleMemberClick(member)}>
              <div className="member-avatar"></div>
              <div className="member-info">
                <strong>{member.user.firstName} {member.user.lastName}</strong>
                <br />
                <code>#{member.user.individualNumber}</code>
                <br />
                <span className="member-email">{member.user.email}</span>
              </div>
              <button className="view-charts-btn">Смотреть графики</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminExpeditionMembersPage;
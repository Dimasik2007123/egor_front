import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import axios from 'axios';
import { expeditionApi } from "../../api/ArcticApi";

function ExpeditionMembersPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    expeditionApi
      .getExpeditionParticipants(id)
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleMemberClick = (member) => {
    navigate(
      `/charts/expeditions/${id}?indNum=${member.user.individualNumber}`,
    );
  };

  if (loading)
    return <div className="members__loading-message">Загрузка...</div>;

  return (
    <div className="members">
      <button
        onClick={() => navigate("/dashboard")}
        className="members__button"
      >
        ← Назад
      </button>
      <h1 className="members__title">Участники экспедиции #{id}</h1>

      <div className="members__row">
        <div className="members__column">
          <div className="members__list">
            {members.map((member) => (
              <div
                key={member.individualNumber}
                className="members__list-item"
                onClick={() => handleMemberClick(member)}
              >
                <strong>
                  {member.user.firstName} {member.user.lastName}
                </strong>
                <br />
                <code>#{member.user.individualNumber}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpeditionMembersPage;

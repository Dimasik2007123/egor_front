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
    navigate(`/charts/expeditions/${id}?indNum=${member.individualNumber}`);
  };

  if (loading)
    return <div className="container mt-5 text-center">Загрузка...</div>;

  return (
    <div className="container mt-4">
      <button
        onClick={() => navigate("/dashboard")}
        className="btn btn-outline-secondary mb-3"
      >
        ← Назад
      </button>
      <h1>Участники экспедиции #{id}</h1>

      <div className="row">
        <div className="col-md-4">
          <div className="list-group">
            {members.map((member) => (
              <div
                key={member.individualNumber}
                className="list-group-item list-group-item-action"
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

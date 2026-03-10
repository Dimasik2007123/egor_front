import { useState, useEffect } from "react";
//import axios from "axios";
import { expeditionApi, userApi } from "../../api/ArcticApi";

function ManageParticipantsModal({
  show,
  onClose,
  expeditionId,
  expeditionName,
}) {
  const [participants, setParticipants] = useState([]);
  const [individualNumber, setIndividualNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (show && expeditionId) {
      loadParticipants();
    }
  }, [show, expeditionId]);

  const loadParticipants = async () => {
    try {
      setLoading(true);
      const data = await expeditionApi.getExpeditionParticipants(expeditionId);
      console.log("Participants loaded:", data);
      setParticipants(data);
    } catch (error) {
      console.error("Load participants error:", error);
      setError("Не удалось загрузить участников");
    } finally {
      setLoading(false);
    }
  };

  const searchUserByIndividualNumber = async () => {
    if (!individualNumber.trim()) {
      setError("Введите индивидуальный номер");
      return;
    }

    try {
      setSearching(true);
      setError("");
      const data = await userApi.searchByIndividualNumber(individualNumber);
      setSearchResults([data]);
    } catch (error) {
      setSearchResults([]);
      setError("Пользователь не найден");
    } finally {
      setSearching(false);
    }
  };

  const addParticipant = async (individualNumber) => {
    try {
      const data = await expeditionApi.addParticipant(
        expeditionId,
        individualNumber,
      );

      console.log("Участник добавлен:", data);
      await loadParticipants();
      setIndividualNumber("");
      setSearchResults([]);
      setError("");
    } catch (error) {
      console.error("Ошибка добавления:", error);
      setError(
        error.response?.data?.message || "Не удалось добавить участника",
      );
    }
  };

  const removeParticipant = async (participantId) => {
    if (!participantId) {
      console.error("participantId is undefined");
      setError("Ошибка: ID участника не найден");
      return;
    }

    if (
      !window.confirm("Вы уверены, что хотите удалить участника из экспедиции?")
    ) {
      return;
    }

    try {
      console.log(
        `Deleting participant ${participantId} from expedition ${expeditionId}`,
      );
      await expeditionApi.removeParticipant(expeditionId, participantId);
      await loadParticipants();
      setError("");
    } catch (error) {
      console.error("Delete error:", error);
      setError(error.response?.data?.message || "Не удалось удалить участника");
    }
  };

  if (!show) return null;

  return (
    <div className="participants-modal">
      <div className="participants-modal__dialog">
        <div className="participants-modal__content">
          <div className="participants-modal__header">
            <h5 className="participants-modal__title">
              🧑‍🤝‍🧑 Участники экспедиции: {expeditionName}
            </h5>
            <button
              type="button"
              className="participants-modal__close"
              onClick={onClose}
            ></button>
          </div>

          <div className="participants-modal__body">
            {error && <div className="participants-modal__alert">{error}</div>}

            <div className="participants-modal__search-card">
              <div className="participants-modal__search-header">
                Добавить участника
              </div>
              <div className="participants-modal__search-body">
                <div className="participants-modal__search-group">
                  <input
                    type="text"
                    className="participants-modal__input"
                    placeholder="Индивидуальный номер (ARCTIC-XXXXX)"
                    value={individualNumber}
                    onChange={(e) => setIndividualNumber(e.target.value)}
                  />
                  <button
                    className="participants-modal__button participants-modal__button--primary"
                    onClick={searchUserByIndividualNumber}
                    disabled={searching}
                  >
                    {searching ? "Поиск..." : "Найти"}
                  </button>
                </div>

                {searchResults.length > 0 && (
                  <div className="participants-modal__results-card">
                    <div className="participants-modal__results-body">
                      {searchResults.map((user) => (
                        <div
                          key={user.id}
                          className="participants-modal__results-item"
                        >
                          <div>
                            <strong>
                              {user.firstName} {user.lastName}
                            </strong>
                            <div className="participants-modal__text--muted-small">
                              {user.email} • {user.individualNumber}
                            </div>
                          </div>
                          <button
                            className="participants-modal__button--success-small"
                            onClick={() =>
                              addParticipant(user.individualNumber)
                            }
                          >
                            Добавить
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="participants-modal__list-card">
              <div className="participants-modal__list-header">
                Список участников ({participants.length})
              </div>
              <div className="participants-modal__list-body">
                {loading ? (
                  <div className="participants-modal__loading">
                    <div className="participants-modal__spinner"></div>
                    <p className="participants-modal__loading-text">
                      Загружаем участников...
                    </p>
                  </div>
                ) : participants.length === 0 ? (
                  <p className="participants-modal__text--muted">
                    В экспедиции пока нет участников
                  </p>
                ) : (
                  <div className="participants-modal__items">
                    {participants.map((participant) => (
                      <div
                        key={participant.participantId}
                        className="participants-modal__item"
                      >
                        <div>
                          <strong>
                            {participant.user.firstName}{" "}
                            {participant.user.lastName}
                          </strong>
                          <div className="participants-modal__text--muted-small">
                            {participant.user.email} •{" "}
                            {participant.user.individualNumber}
                          </div>
                          <div className="participants-modal__text--muted-small">
                            Присоединился:{" "}
                            {new Date(
                              participant.joinedAt,
                            ).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          className="participants-modal__button--outline-danger-small"
                          onClick={() =>
                            removeParticipant(participant.participantId)
                          }
                          title="Удалить из экспедиции"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="participants-modal__footer">
            <button
              type="button"
              className="participants-modal__footer-button"
              onClick={onClose}
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageParticipantsModal;

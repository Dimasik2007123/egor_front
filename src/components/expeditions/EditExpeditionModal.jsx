import { useState, useEffect } from "react";

function EditExpeditionModal({
  show,
  onClose,
  expedition,
  onUpdate,
  onDelete,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (expedition) {
      setFormData({
        name: expedition.name || "",
        description: expedition.description || "",
        startDate: expedition.startDate
          ? expedition.startDate.split("T")[0]
          : "",
        endDate: expedition.endDate ? expedition.endDate.split("T")[0] : "",
      });
    }
  }, [expedition]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onUpdate(formData);
    } catch (error) {
      setError(
        error.response?.data?.message || "Ошибка при обновлении экспедиции",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    try {
      await onDelete();
    } catch (error) {
      console.error("Delete error:", error);
      setError("Не удалось удалить экспедицию");
      setDeleteConfirm(false);
    }
  };

  if (!show || !expedition) return null;

  return (
    <div className="edit-modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="edit-modal__dialog">
        <div className="edit-modal__content">
          <div className="edit-modal__header">
            <h5 className="edit-modal__title">✏️ Редактировать экспедицию</h5>
            <button
              type="button"
              className="edit-modal__button-close"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="edit-modal__form-body">
              {error && <div className="edit-modal__alert">{error}</div>}

              <div className="edit-modal__form-field">
                <label className="edit-modal__form-label">
                  Название экспедиции *
                </label>
                <input
                  type="text"
                  className="edit-modal__form-input"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="edit-modal__form-field">
                <label className="edit-modal__form-label">Описание</label>
                <textarea
                  className="edit-modal__form-input"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="edit-modal__row">
                <div className="edit-modal__column">
                  <label className="edit-modal__form-label">
                    Дата начала *
                  </label>
                  <input
                    type="date"
                    className="edit-modal__form-input"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="edit-modal__column">
                  <label className="edit-modal__form-label">
                    Дата окончания *
                  </label>
                  <input
                    type="date"
                    className="edit-modal__form-input"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="edit-modal__footer">
              <div className="edit-modal__footer-actions">
                <div className="edit-modal__footer-actions-group">
                  {!deleteConfirm ? (
                    <button
                      type="button"
                      className="edit-modal__footer-button--outline-danger"
                      onClick={handleDelete}
                      disabled={loading}
                    >
                      🗑️ Удалить экспедицию
                    </button>
                  ) : (
                    <div className="edit-modal__footer-confirm">
                      <button
                        type="button"
                        className="edit-modal__footer-button--danger"
                        onClick={handleDelete}
                        disabled={loading}
                      >
                        ✅ Подтвердить удаление
                      </button>
                    </div>
                  )}
                </div>

                <div className="edit-modal__footer-actions-group">
                  <button
                    type="button"
                    className="edit-modal__footer-button--secondary"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="edit-modal__footer-button--primary"
                    disabled={loading}
                  >
                    {loading ? "Сохранение..." : "Сохранить"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditExpeditionModal;

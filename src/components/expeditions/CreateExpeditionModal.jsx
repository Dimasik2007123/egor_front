import { useState } from "react";

function CreateExpeditionModal({ show, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const getDateString = (date) => {
    return date.toISOString().split("T")[0];
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 8);

  if (!formData.startDate) {
    setFormData((prev) => ({
      ...prev,
      startDate: getDateString(tomorrow),
      endDate: getDateString(nextWeek),
    }));
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Название обязательно";
    } else if (formData.name.length < 3) {
      newErrors.name = "Название должно быть не менее 3 символов";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Дата начала обязательна";
    } 

    if (!formData.endDate) {
      newErrors.endDate = "Дата окончания обязательна";
    } else if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = "Дата окончания должна быть после даты начала";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      await onSubmit(formData);
      setFormData({
        name: "",
        description: "",
        startDate: getDateString(tomorrow),
        endDate: getDateString(nextWeek),
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Create expedition error:", error);
      setSubmitError(
        error.response?.data?.message ||
          error.response?.data?.errors?.[0]?.message ||
          "Ошибка при создании экспедиции",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="create-modal">
      <div className="create-modal__dialog">
        <div className="create-modal__content">
          <div className="create-modal__header--primary">
            <h5 className="create-modal__title">🏔️ Создать новую экспедицию</h5>
            <button
              type="button"
              className="create-modal__button-close"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="create-modal__form-body">
              {submitError && (
                <div className="create-modal__form--error">{submitError}</div>
              )}

              <div className="create-modal__form-field">
                <label className="create-modal__form-label">
                  Название экспедиции *
                </label>
                <input
                  type="text"
                  className={`create-modal__form-input ${errors.name ? "create-modal__form-input--is-invalid" : ""}`}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Например: Арктика-2024"
                  disabled={loading}
                />
                {errors.name && (
                  <div className="create-modal__form-field--error">
                    {errors.name}
                  </div>
                )}
                <div className="create-modal__form-text">
                  Придумайте понятное название для экспедиции (3-100 символов)
                </div>
              </div>

              <div className="create-modal__form-field">
                <label className="create-modal__form-label">
                  Описание экспедиции
                </label>
                <textarea
                  className="create-modal__form-input"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Цели экспедиции, маршрут, особенности..."
                  disabled={loading}
                  maxLength="500"
                />
                <div className="create-modal__form-text">
                  Описание поможет участникам понять цели экспедиции. Максимум
                  500 символов.
                  <span className="create-modal__form-text-length">
                    {formData.description.length}/500
                  </span>
                </div>
              </div>

              <div className="create-modal__row">
                <div className="create-modal__column">
                  <label className="create-modal__form-label">
                    Дата начала *
                  </label>
                  <input
                    type="date"
                    className={`create-modal__form-input ${errors.startDate ? "create-modal__form-input--is-invalid" : ""}`}
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.startDate && (
                    <div className="create-modal__form-field--error">
                      {errors.startDate}
                    </div>
                  )}
                </div>

                <div className="create-modal__column">
                  <label className="create-modal__form-label">
                    Дата окончания *
                  </label>
                  <input
                    type="date"
                    className={`create-modal__form-input ${errors.endDate ? "create-modal__form-input--is-invalid" : ""}`}
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    disabled={loading}
                    min={formData.startDate}
                  />
                  {errors.endDate && (
                    <div className="create-modal__form-field--error">
                      {errors.endDate}
                    </div>
                  )}
                </div>
              </div>

              <div className="create-modal__alert">
                <h6 className="create-modal__alert-title">💡 Информация:</h6>
                <ul className="create-modal__alert-list">
                  <li className="create-modal__alert-list-item">
                    После создания экспедиции вы сможете добавить участников
                  </li>
                  <li className="create-modal__alert-list-item">
                    Участники добавляются по их индивидуальному номеру
                  </li>
                  <li className="create-modal__alert-list-item">
                    Вы будете автоматически назначены руководителем этой
                    экспедиции
                  </li>
                </ul>
              </div>
            </div>

            <div className="create-modal__footer">
              <button
                type="button"
                className="create-modal__footer-button--secondary"
                onClick={onClose}
                disabled={loading}
              >
                Отмена
              </button>
              <button
                type="submit"
                className="create-modal__footer-button--primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="create-modal__spinner"></span>
                    Создание...
                  </>
                ) : (
                  "Создать экспедицию"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateExpeditionModal;

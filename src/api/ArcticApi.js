import api from "./fetchConfig";

const handleResponse = async (response) => {
  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const authApi = {
  login: (email, password) =>
    api.post("/auth/login", { email, password }).then(handleResponse),

  logout: () => api.post("/auth/logout", {}).then(handleResponse),

  register: (userData) =>
    api.post("/auth/register", userData).then(handleResponse),
};

export const expeditionApi = {
  getMyExpeditions: () => api.get("/expeditions/my").then(handleResponse),

  createExpedition: (data) =>
    api.post("/expeditions", data).then(handleResponse),

  getExpeditionDetails: (id) =>
    api.get(`/expeditions/${id}`).then(handleResponse),

  getExpeditionParticipants: (expeditionId) =>
    api.get(`/expeditions/${expeditionId}/participants`).then(handleResponse),

  addParticipant: (expeditionId, individualNumber) =>
    api
      .post(`/expeditions/${expeditionId}/participants`, { individualNumber })
      .then(handleResponse),

  deleteExpedition: (expeditionId) =>
    api.delete(`/expeditions/${expeditionId}`).then(handleResponse),

  editExpedition: (expeditionId, data) =>
    api.put(`/expeditions/${expeditionId}`, data).then(handleResponse),

  removeParticipant: (expeditionId, participantId) =>
    api
      .delete(`/expeditions/${expeditionId}/participants/${participantId}`)
      .then(handleResponse),

  leaveExpedition: (expeditionId) =>
    api.delete(`/expeditions/${expeditionId}/leave`).then(handleResponse),
};

export const userApi = {
  searchByIndividualNumber: (individualNumber) =>
    api
      .get(`/users/search/by-individual-number/${individualNumber}`)
      .then(handleResponse),
};

export const adminApi = {
  getUsers: () => api.get("/admin/users").then(handleResponse),

  promoteToLeader: (userId) =>
    api.patch(`/admin/users/${userId}/roles/leader`, {}).then(handleResponse),

  promoteToAdmin: (userId) =>
    api.patch(`/admin/users/${userId}/roles/admin`, {}).then(handleResponse),
};

export const chartsApi = {
  getExpeditionCharts: (expeditionId, indNum) =>
    api
      .get(`/charts/expeditions/${expeditionId}?indNum=${indNum}`)
      .then(handleResponse),

  getMyCharts: (expeditionId) => {
    const indNum = localStorage.getItem("individualNumber");
    return api
      .get(`/charts/expeditions/${expeditionId}?indNum=${indNum}`)
      .then(handleResponse);
  },

  getParticipantCharts: (expeditionId, indNum) =>
    api
      .get(`/charts/expeditions/${expeditionId}?indNum=${indNum}`)
      .then(handleResponse),
};

export default api;

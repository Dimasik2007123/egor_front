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

  deleteAdminRole: (userId) =>
    api.delete(`/admin/users/${userId}/roles/admin`, {}).then(handleResponse),

  deleteLeaderRole: (userId) =>
    api.delete(`/admin/users/${userId}/roles/leader`, {}).then(handleResponse),
};

export const chartsApi = {
  getParticipantCharts: async (expeditionId, indNum) => {
    const response = await api.get(`/charts/${expeditionId}/${indNum}`);
    const data = await response.json();

    return {
      ...data,
      charts: data.charts.map((chart) => ({
        ...chart,
        imageBase64: `data:image/png;base64,${btoa(
          String.fromCharCode(...new Uint8Array(chart.image)),
        )}`,
      })),
    };
  },

  getChartImage: (expeditionId, chartType, indNum) =>
    api
      .get(
        `/charts/expeditions/${expeditionId}/${chartType}?indNum=${indNum}`,
        {
          headers: { Accept: "image/png" },
        },
      )
      .then((response) => response.blob())
      .then((blob) => URL.createObjectURL(blob)),

  getMyCharts: async (expeditionId) => {
    const indNum = localStorage.getItem("individualNumber");
    const response = await api.get(`/charts/${expeditionId}/${indNum}`);
    const data = await response.json();

    return {
      ...data,
      charts: data.charts.map((chart) => ({
        ...chart,
        imageBase64: `data:image/png;base64,${btoa(
          String.fromCharCode(...new Uint8Array(chart.image)),
        )}`,
      })),
    };
  },
};

export const analyticsApi = {
  getAdvice: (expeditionId, indNum) =>
    api
      .get(`/analytics/advices/${indNum}/${expeditionId}`)
      .then(handleResponse),
};

export default api;

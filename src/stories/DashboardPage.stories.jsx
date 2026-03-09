import DashboardPage from "../pages/DashboardPage";
import { expeditionApi, authApi, userApi } from "../api/ArcticApi";
import { MemoryRouter, Routes, Route } from "react-router-dom";

const mockExpeditions = {
  asLeader: [
    {
      id: 1,
      name: "Арктическая экспедиция 2026",
      description: "Изучение ледников и сбор образцов",
      startDate: "2026-06-15T00:00:00",
      endDate: "2026-08-20T00:00:00",
      role: "LEADER",
      leaderFirstName: "Иван",
      leaderLastName: "Петров",
      leaderEmail: "ivan@arctic.ru",
      createdAt: "2026-01-10T12:00:00",
    },
    {
      id: 2,
      name: "Экспедиция на Северный полюс",
      description: "Исследование климатических изменений",
      startDate: "2026-07-01T00:00:00",
      endDate: "2026-09-15T00:00:00",
      role: "LEADER",
      leaderFirstName: "Иван",
      leaderLastName: "Петров",
      leaderEmail: "ivan@arctic.ru",
      createdAt: "2026-02-15T12:00:00",
    },
  ],
  asParticipant: [
    {
      id: 3,
      name: "Гренландская экспедиция",
      description: "Изучение ледникового покрова",
      startDate: "2026-05-10T00:00:00",
      endDate: "2026-06-20T00:00:00",
      role: "USER",
      leaderFirstName: "Петр",
      leaderLastName: "Сидоров",
      leaderEmail: "petr@arctic.ru",
      createdAt: "2026-03-20T12:00:00",
    },
  ],
};

const mockApi = {
  getMyExpeditions: async () => mockExpeditions,
  logout: async () => null,
};

export default {
  title: "Pages/DashboardPage",
  component: DashboardPage,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => {
      expeditionApi.getMyExpeditions = mockApi.getMyExpeditions;
      authApi.logout = mockApi.logout;

      return (
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route path="/dashboard" element={<Story />} />
            <Route path="/login" element={<div />} />
            <Route path="/admin" element={<div />} />
          </Routes>
        </MemoryRouter>
      );
    },
  ],
};

export const Default = {
  decorators: [
    (Story) => (
      <div
        onClickCapture={(e) => {
          if (
            e.target.tagName === "BUTTON" ||
            e.target.closest(".list-group-item")
          ) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Навигация отключена в Storybook");
          }
        }}
      >
        <Story />
      </div>
    ),
  ],
};

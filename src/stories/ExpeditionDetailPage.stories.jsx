import ExpeditionDetailPage from "../pages/ExpeditionDetailPage";
import { expeditionApi } from "../api/ArcticApi";
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

const mockParticipants = [
  {
    participantId: 101,
    user: {
      id: 1,
      firstName: "Иван",
      lastName: "Петров",
      email: "ivan@arctic.ru",
      individualNumber: "ARCTIC-001",
    },
    joinedAt: "2026-03-01T12:00:00",
  },
  {
    participantId: 102,
    user: {
      id: 2,
      firstName: "Мария",
      lastName: "Сидорова",
      email: "maria@arctic.ru",
      individualNumber: "ARCTIC-002",
    },
    joinedAt: "2026-03-02T12:00:00",
  },
];

export default {
  title: "Pages/ExpeditionDetailPage",
  component: ExpeditionDetailPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      expeditionApi.getMyExpeditions = async () => mockExpeditions;
      expeditionApi.getExpeditionParticipants = async () => mockParticipants;

      expeditionApi.addParticipant = async () => {
        console.log("addParticipant отключен");
        return null;
      };
      expeditionApi.removeParticipant = async () => {
        console.log("removeParticipant отключен");
        return null;
      };
      return (
        <MemoryRouter initialEntries={["/expeditions/1"]}>
          <Routes>
            <Route path="/expeditions/:id" element={<Story />} />
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
          if (e.target.closest(".nav-link")) {
            return;
          }

          if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Действие отключено в Storybook");
            return false;
          }
        }}
      >
        <Story />
      </div>
    ),
  ],
};

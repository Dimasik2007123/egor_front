import ExpeditionMembersPage from "../pages/expedition/ExpeditionMembersPage";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { expeditionApi } from "../api/ArcticApi";

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
  title: "Modals/ExpeditionMembersPage",
  component: ExpeditionMembersPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      expeditionApi.getExpeditionParticipants = async () => mockParticipants;
      return (
        <MemoryRouter initialEntries={["/expeditions/1/participants"]}>
          <Routes>
            <Route path="/expeditions/:id/participants" element={<Story />} />
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
          e.preventDefault();
          e.stopPropagation();
          console.log("Навигация отключена в Storybook");

          return false;
        }}
      >
        <Story />
      </div>
    ),
  ],
};

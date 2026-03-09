import { MemoryRouter } from "react-router-dom";
import ExpeditionList from "../components/expeditions/ExpeditionList";

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

export default {
  title: "Components/ExpeditionList",
  component: ExpeditionList,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export const MixedExpeditions = {
  args: {
    expeditions: [
      ...mockExpeditions.asLeader,
      ...mockExpeditions.asParticipant,
    ],
    showRole: true,
    onRefresh: () => console.log("Refresh clicked"),
    onManageParticipants: (expedition) =>
      console.log("Manage participants:", expedition.id),
    onEditExpedition: (expedition) =>
      console.log("Edit expedition:", expedition.id),
  },
};

import EditExpeditionModal from "../components/expeditions/EditExpeditionModal";

const mockExpedition = {
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
};

export default {
  title: "Modals/EditExpeditionModal",
  component: EditExpeditionModal,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "20px", minHeight: "600px" }}>
        <Story />
      </div>
    ),
  ],
};

export const Default = {
  args: {
    show: true,
    expedition: mockExpedition,
    onClose: () => console.log("Modal closed"),
    onUpdate: async () => {
      await new Promise(() => {});
    },
    onDelete: async () => console.log("Delete clicked"),
  },
};

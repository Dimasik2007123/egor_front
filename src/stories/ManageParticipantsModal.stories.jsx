import ManageParticipantsModal from "../components/expeditions/ManageParticipantsModal";
import { expeditionApi, userApi } from "../api/ArcticApi";

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

const mockFoundUser = {
  id: 3,
  firstName: "Алексей",
  lastName: "Иванов",
  email: "alexey@arctic.ru",
  individualNumber: "ARCTIC-003",
};

export default {
  title: "Modals/ManageParticipantsModal",
  component: ManageParticipantsModal,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => {
      expeditionApi.getExpeditionParticipants = async () => mockParticipants;
      userApi.searchByIndividualNumber = async () => mockFoundUser;
      expeditionApi.addParticipant = async () => ({ success: true });
      expeditionApi.removeParticipant = async () => null;
      return (
        <div style={{ padding: "20px", minHeight: "600px" }}>
          <Story />
        </div>
      );
    },
  ],
};

export const Default = {
  args: {
    show: true,
    expeditionId: 1,
    expeditionName: "Арктическая экспедиция 2026",
    onClose: () => console.log("Modal closed"),
  },
};

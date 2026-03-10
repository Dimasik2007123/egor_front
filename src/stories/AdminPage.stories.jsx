import AdminPage from "../pages/AdminPage";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { adminApi } from "../api/ArcticApi";

const mockUsers = [
  {
    id: 1,
    firstName: "Иван",
    lastName: "Петров",
    email: "example1@mail.ru",
    individualNumber: 11,
    roles: ["ROLE_LEADER"],
  },
  {
    id: 2,
    firstName: "Петр",
    lastName: "Иванов",
    email: "example2@mail.ru",
    individualNumber: 12,
    roles: ["ROLE_LEADER", "ROLE_ADMIN"],
  },
  {
    id: 3,
    firstName: "Семен",
    lastName: "Сидоров",
    email: "example3@mail.ru",
    individualNumber: 13,
    roles: ["ROLE_USER"],
  },
];

export default {
  title: "Pages/AdminPage",
  component: AdminPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      adminApi.getUsers = async () => mockUsers;
      adminApi.promoteToAdmin = async (userId) => null;
      adminApi.promoteToLeader = async (userId) => null;
      return (
        <MemoryRouter initialEntries={["/admin"]}>
          <Routes>
            <Route path="/admin" element={<Story />} />
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
          if (e.target.tagName === "BUTTON") {
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

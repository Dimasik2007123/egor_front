import LoginPage from "../pages/LoginPage";
import { authApi } from "../api/ArcticApi";
import { MemoryRouter, Routes, Route } from "react-router-dom";

export default {
  title: "Pages/LoginPage",
  component: LoginPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      authApi.login = async () => undefined;

      return (
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route path="/login" element={<Story />} />
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
          if (e.target.tagName === "A" || e.target.closest("a")) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Навигация по ссылке отключена в Storybook");
            return false;
          }
        }}
      >
        <Story />
      </div>
    ),
  ],
};

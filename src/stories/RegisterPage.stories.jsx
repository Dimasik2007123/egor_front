import RegisterPage from "../pages/RegisterPage";
import { authApi } from "../api/ArcticApi";
import { MemoryRouter, Routes, Route } from "react-router-dom";

export default {
  title: "Pages/RegisterPage",
  component: RegisterPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      authApi.register = async () => null;

      return (
        <MemoryRouter initialEntries={["/register"]}>
          <Routes>
            <Route path="/register" element={<Story />} />
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
            e.target.tagName === "A" ||
            e.target.closest("a") ||
            e.target.tagName === "BUTTON"
          ) {
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

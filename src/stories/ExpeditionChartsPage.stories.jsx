import ExpeditionChartsPage from "../pages/charts/ExpeditionChartsPage";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { chartsApi } from "../api/ArcticApi";

const mockChartData = {
  data: {
    "heart-rate":
      "https://python-heart-rate-analysis-toolkit.readthedocs.io/en/latest/_images/output2.jpeg",
    fatigue:
      "https://studfile.net/html/2706/963/html_IJIQzckqnY.HSqN/htmlconvd-uCm78s_html_f3cfa24fd0ce1e35.png",
  },
};

export default {
  title: "Pages/ExpeditionChartsPage",
  component: ExpeditionChartsPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      chartsApi.getExpeditionCharts = async () => mockChartData;

      return (
        <MemoryRouter
          initialEntries={["/charts/expeditions/1?indNum=ARCTIC-001"]}
        >
          <Routes>
            <Route path="/charts/expeditions/:id" element={<Story />} />
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
          const target = e.target;
          if (
            target.tagName === "BUTTON" &&
            target.textContent.includes("Выбрать другого участника")
          ) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Навигация отключена в Storybook");
            return false;
          }
        }}
      >
        <Story />
      </div>
    ),
  ],
};

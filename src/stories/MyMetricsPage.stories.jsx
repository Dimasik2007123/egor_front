import MyMetricsPage from "../pages/MyMetricsPage";
import { chartsApi, expeditionApi } from "../api/ArcticApi";
import { MemoryRouter, Routes, Route } from "react-router-dom";

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

const testImageBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

const mockChartData = {
  indNum: "ARCTIC-001",
  expeditionId: 1,
  charts: [
    {
      chartType: "alpha-beta-theta",
      imageBase64: testImageBase64,
    },
    {
      chartType: "fatigue",
      imageBase64: testImageBase64,
    },
    {
      chartType: "heart-rate",
      imageBase64: testImageBase64,
    },
    {
      chartType: "psychological-fatigue",
      imageBase64: testImageBase64,
    },
    {
      chartType: "gravity",
      imageBase64: testImageBase64,
    },
    {
      chartType: "concentration",
      imageBase64: testImageBase64,
    },
    {
      chartType: "relaxation",
      imageBase64: testImageBase64,
    },
    {
      chartType: "nlp",
      imageBase64: testImageBase64,
    },
  ],
};

export default {
  title: "Pages/MyMetricsPage",
  component: MyMetricsPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      chartsApi.getMyCharts = async () => mockChartData;
      expeditionApi.getExpeditionDetails = async () => mockExpedition;

      return (
        <MemoryRouter initialEntries={["/expeditions/1/my-metrics"]}>
          <Routes>
            <Route
              path="/expeditions/:expeditionId/my-metrics"
              element={<Story />}
            />
            <Route path="/expeditions/:expeditionId" element={<div />} />
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
          if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
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

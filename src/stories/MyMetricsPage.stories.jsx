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

const mockChartData = {
  stats: {
    fatigue: { avg: 4.5, min: 2, max: 7 },
    heart_rate: { avg: 72, min: 65, max: 82 },
    concentration: { avg: 7.8, min: 6, max: 9 },
    productivity: { avg: 6.5, min: 5, max: 8 },
  },
  charts: {
    fatigue_chart:
      '<div style="background: #f0f0f0; height: 200px; display: flex; align-items: center; justify-content: center; text-align: center">График усталости и концентрации</div>',
    heart_rate_chart:
      '<div style="background: #f0f0f0; height: 200px; display: flex; align-items: center; justify-content: center; text-align: center">График ЧСС</div>',
    composite_chart:
      '<div style="background: #f0f0f0; height: 200px; display: flex; align-items: center; justify-content: center; text-align: center">Комбинированный график</div>',
  },
  period: "Март 2026",
  total_measurements: 150,
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

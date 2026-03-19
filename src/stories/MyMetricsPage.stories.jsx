import MyMetricsPage from "../pages/MyMetricsPage";
import { chartsApi, expeditionApi, analyticsApi } from "../api/ArcticApi";
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

const mockChartUrls = {
  "heart-rate":
    "https://python-heart-rate-analysis-toolkit.readthedocs.io/en/latest/_images/output2.jpeg",
  fatigue:
    "https://studfile.net/html/2706/963/html_IJIQzckqnY.HSqN/htmlconvd-uCm78s_html_f3cfa24fd0ce1e35.png",
  "alpha-beta-theta":
    "https://storage.yandexcloud.net/wr4img/1116686275_i_001b.png",
  "psychological-fatigue":
    "https://avatars.mds.yandex.net/i?id=048c5c36cba0f253e76f2bb74bd7da52_l-5236157-images-thumbs&n=13",
  gravity:
    "https://storage.googleapis.com/files.bitscreener.com/static/img/thumbnail/coins/gravity-token.png",
  concentration:
    "https://avatars.dzeninfra.ru/get-zen_doc/1362956/pub_5adc6d46bce67e90d2a46acf_5adc6db100b3ddc88a039985/scale_1200",
  relaxation:
    "https://img.freepik.com/premium-vector/serene-woman-relaxing-mat-vector-illustration_1316704-34671.jpg?semt=ais_hybrid",
  nfb: "https://психолог-иваново.рф/img/u/68da3f08658e1.png",
};

export default {
  title: "Pages/MyMetricsPage",
  component: MyMetricsPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      chartsApi.getChartImage = async (id, chartType, indNum) => {
        return mockChartUrls[chartType];
      };
      expeditionApi.getMyExpeditions = async () => ({
        asLeader: [mockExpedition],
        asParticipant: [],
      });
      expeditionApi.getExpeditionDetails = async () => mockExpedition;
      analyticsApi.getAdvice = async () => ({
        response: "Соблюдайте режим питания и сна",
      });

      const originalLocalStorage = global.localStorage;

      const mockStorage = {
        ...originalLocalStorage,
        getItem: (key) => {
          if (key === "userEmail") return "ivan@arctic.ru";
          if (key === "individualNumber") return "ARCTIC-001";
          return originalLocalStorage.getItem(key);
        },
      };

      Object.defineProperty(global, "localStorage", {
        value: mockStorage,
        writable: true,
        configurable: true,
      });

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

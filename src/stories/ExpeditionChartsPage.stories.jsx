import ExpeditionChartsPage from "../pages/charts/ExpeditionChartsPage";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { chartsApi } from "../api/ArcticApi";

const mockChartData = {
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
  title: "Pages/ExpeditionChartsPage",
  component: ExpeditionChartsPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      chartsApi.getChartImage = async (id, chartType, indNum) => {
        return mockChartData[chartType];
      };

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

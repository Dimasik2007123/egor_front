/** @type { import('@storybook/react-vite').Preview } */
import "../src/assets/animations.css";
import "../src/assets/fonts.css";
import "../src/assets/styles_new.css";
//import "bootstrap/dist/css/bootstrap.min.css";

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;

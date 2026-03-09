import { useState } from "react";
import CreateExpeditionModal from "../components/expeditions/CreateExpeditionModal";

export default {
  title: "Modals/CreateExpeditionModal",
  component: CreateExpeditionModal,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "20px", minHeight: "600px" }}>
        <Story />
      </div>
    ),
  ],
};

const Template = (args) => {
  const [show, setShow] = useState(args.show);

  return (
    <>
      <CreateExpeditionModal
        {...args}
        show={show}
        onClose={async () => {
          await new Promise(() => {});
        }}
        onSubmit={async () => {
          await new Promise(() => {});
        }}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  show: true,
};

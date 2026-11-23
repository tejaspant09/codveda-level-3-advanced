import { Card, Button } from "./index.jsx";
export default {
  title: "Still UI/Card",
  component: Card,
  tags: ["autodocs"],
  args: {
    title: "Make room for focus",
    children: "One task. A little time. A clear place to begin.",
  },
  decorators: [
    (Story) => (
      <div className="still-story">
        <Story />
      </div>
    ),
  ],
};
export const Default = {};
export const WithoutTitle = {
  args: {
    title: undefined,
    children: "A simple container for related content.",
  },
};
export const WithAction = {
  args: {
    children: (
      <>
        <p>Your next session is ready.</p>
        <Button
          onClick={(event) => {
            event.currentTarget.textContent = "Session started";
          }}
        >
          Start session
        </Button>
      </>
    ),
  },
};

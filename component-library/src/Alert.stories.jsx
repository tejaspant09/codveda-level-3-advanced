import { useState } from "react";
import { Alert, Button } from "./index.jsx";
export default {
  title: "Still UI/Alert",
  component: Alert,
  tags: ["autodocs"],
  args: {
    title: "Session saved",
    children: "Your session is ready when you are.",
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
export const Danger = {
  args: {
    variant: "danger",
    title: "Could not save",
    children: "Check the session name and try again.",
  },
};
export const Interaction = {
  render: function Interaction() {
    const [saved, setSaved] = useState(false);
    return (
      <>
        <Button onClick={() => setSaved(true)}>Save session</Button>
        {saved && (
          <Alert title="Session saved">You can start another session.</Alert>
        )}
      </>
    );
  },
};

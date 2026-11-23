import { useState } from "react";
import { Button } from "./index.jsx";

export default {
  title: "Still UI/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Start focus" },
};
export const Default = {};
export const Secondary = {
  args: { variant: "secondary", children: "Take a break" },
};
export const Disabled = { args: { disabled: true } };
export const Loading = { args: { loading: true, children: "Saving session" } };
export const Interaction = {
  render: function Interaction() {
    const [count, setCount] = useState(0);
    return (
      <div className="still-story">
        <Button onClick={() => setCount(count + 1)}>Complete a session</Button>
        <output aria-live="polite">Sessions completed: {count}</output>
      </div>
    );
  },
};

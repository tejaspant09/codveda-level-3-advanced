import { useState } from "react";
import { TextField, Button } from "./index.jsx";

export default {
  title: "Still UI/TextField",
  component: TextField,
  tags: ["autodocs"],
  args: { label: "Session name", placeholder: "Write a first draft" },
  decorators: [
    (Story) => (
      <div className="still-story">
        <Story />
      </div>
    ),
  ],
};
export const Default = {};
export const WithHint = {
  args: { hint: "A short label helps you find this session later." },
};
export const WithError = {
  args: { error: "Enter a session name.", hint: "Use up to 80 characters." },
};
export const Disabled = {
  args: { disabled: true, defaultValue: "Reading time" },
};
export const Interaction = {
  render: function Interaction() {
    const [value, setValue] = useState("");
    const [submitted, setSubmitted] = useState(false);
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
        className="still-story"
      >
        <TextField
          label="Session name"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setSubmitted(false);
          }}
          error={
            submitted && !value.trim() ? "Enter a session name." : undefined
          }
          hint="Name what you want to focus on."
        />
        <Button type="submit">Save session</Button>
        {submitted && value.trim() && (
          <output aria-live="polite">Saved: {value}</output>
        )}
      </form>
    );
  },
};

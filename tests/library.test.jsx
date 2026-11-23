import React, { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Button,
  TextField,
  Card,
  Alert,
} from "../component-library/src/index.jsx";

describe("Still UI", () => {
  it("uses a safe button default and allows explicit native form submission", async () => {
    const user = userEvent.setup();
    const submit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={submit}>
        <Button>Preview</Button>
        <Button type="submit">Save</Button>
      </form>,
    );
    await user.click(screen.getByRole("button", { name: "Preview" }));
    expect(submit).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("blocks native disabled and loading actions while retaining accessible names", async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    render(
      <>
        <Button disabled onClick={action}>
          Disabled
        </Button>
        <Button loading onClick={action}>
          Saving
        </Button>
      </>,
    );
    await user.click(screen.getByRole("button", { name: "Disabled" }));
    await user.click(screen.getByRole("button", { name: "Saving" }));
    expect(action).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Saving" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });

  it("connects labels, hint, error and an existing external description", async () => {
    const user = userEvent.setup();
    render(
      <>
        <p id="policy">Private to this browser.</p>
        <TextField
          label="Session"
          hint="Keep it short."
          error="A name is required."
          aria-describedby="policy"
          name="session"
          data-example="field"
        />
      </>,
    );
    const input = screen.getByRole("textbox", { name: "Session" });
    expect(input).toHaveAccessibleDescription(
      "Private to this browser. Keep it short. A name is required.",
    );
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("data-example", "field");
    await user.click(screen.getByText("Session", { selector: "label" }));
    expect(input).toHaveFocus();
    await user.type(input, "Read");
    expect(input).toHaveValue("Read");
  });

  it("keeps generated field IDs distinct and stable across renders", () => {
    const view = render(
      <>
        <TextField label="First" hint="One" />
        <TextField label="Second" hint="Two" />
      </>,
    );
    const firstId = screen.getByLabelText("First").id;
    expect(firstId).not.toBe(screen.getByLabelText("Second").id);
    view.rerender(
      <>
        <TextField label="First" error="Fix this" />
        <TextField label="Second" hint="Two" />
      </>,
    );
    expect(screen.getByLabelText("First").id).toBe(firstId);
    expect(screen.getByLabelText("First")).toHaveAccessibleDescription(
      "Fix this",
    );
  });

  it("forwards native refs and props to controls", () => {
    const inputRef = createRef();
    const buttonRef = createRef();
    render(
      <>
        <TextField
          label="Email"
          id="email"
          type="email"
          autoComplete="email"
          required
          ref={inputRef}
        />
        <Button ref={buttonRef} data-track="save">
          Save
        </Button>
      </>,
    );
    expect(inputRef.current).toBe(screen.getByLabelText("Email"));
    expect(inputRef.current).toHaveAttribute("id", "email");
    expect(inputRef.current).toBeRequired();
    expect(buttonRef.current).toHaveAttribute("data-track", "save");
  });

  it("names titled cards and exposes the appropriate announcement roles", () => {
    render(
      <>
        <Card title="Today" data-view="summary">
          A quiet morning.
        </Card>
        <Alert title="Saved">Ready to continue.</Alert>
        <Alert variant="danger">Could not save.</Alert>
      </>,
    );
    expect(screen.getByRole("region", { name: "Today" })).toHaveAttribute(
      "data-view",
      "summary",
    );
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
    expect(screen.getByRole("alert")).toHaveTextContent("Could not save.");
  });
});

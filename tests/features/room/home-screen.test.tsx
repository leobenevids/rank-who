import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { HomeScreen } from "@/features/room/components/home-screen";

describe("HomeScreen", () => {
  test("renders create and join forms and delegates submit events", () => {
    const onCreateSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) =>
      event.preventDefault(),
    );
    const onJoinSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) =>
      event.preventDefault(),
    );
    const onNameChange = vi.fn();
    const onCodeChange = vi.fn();

    render(
      <HomeScreen
        createName="Leo"
        joinName="Maria"
        joinCode="AB12"
        disabled={false}
        createError={null}
        joinError={null}
        onCreateSubmit={onCreateSubmit}
        onJoinSubmit={onJoinSubmit}
        onCreateNameChange={onNameChange}
        onJoinNameChange={onNameChange}
        onJoinCodeChange={onCodeChange}
      />,
    );

    expect(screen.getByRole("heading", { name: /create room/i })).toBeVisible();
    expect(screen.getByRole("heading", { name: /join room/i })).toBeVisible();

    fireEvent.submit(screen.getByTestId("create-room-form"));
    fireEvent.submit(screen.getByTestId("join-room-form"));

    expect(onCreateSubmit).toHaveBeenCalledTimes(1);
    expect(onJoinSubmit).toHaveBeenCalledTimes(1);
  });
});

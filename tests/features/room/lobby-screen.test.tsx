import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { LobbyScreen } from "@/features/room/components/lobby-screen";
import type { Room } from "@/shared/types/game";

const room: Room = {
  id: "room-1",
  code: "AB12",
  phase: "lobby",
  theme: null,
  top_n: 5,
  host_id: "player-1",
  expires_at: null,
  players: [
    {
      id: "player-1",
      room_id: "room-1",
      user_id: "user-1",
      name: "Leo",
      avatar: "🧙",
      is_host: true,
      is_afk: false,
    },
    {
      id: "player-2",
      room_id: "room-1",
      user_id: "user-2",
      name: "Maria",
      avatar: "🤖",
      is_host: false,
      is_afk: false,
    },
  ],
};

describe("LobbyScreen", () => {
  test("shows room code, players and host-only start action", () => {
    render(
      <LobbyScreen
        room={room}
        currentPlayerId="player-1"
        isStarting={false}
        onStart={vi.fn()}
      />,
    );

    expect(screen.getByText("AB12")).toBeVisible();
    expect(screen.getByText("Leo")).toBeVisible();
    expect(screen.getByText("Maria")).toBeVisible();
    expect(screen.getByRole("button", { name: /start game/i })).toBeEnabled();
    expect(screen.getByText(/host/i)).toBeVisible();
    expect(screen.getByText(/you/i)).toBeVisible();
  });

  test("hides start action from non-host players", () => {
    render(
      <LobbyScreen
        room={room}
        currentPlayerId="player-2"
        isStarting={false}
        onStart={vi.fn()}
      />,
    );

    expect(
      screen.queryByRole("button", { name: /start game/i }),
    ).not.toBeInTheDocument();
  });
});

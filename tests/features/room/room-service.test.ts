import { beforeEach, describe, expect, test } from "vitest";

import {
  createRoom,
  joinRoom,
  startSuggesting,
  type RoomRepository,
} from "@/features/room/lib/room-service";

type InMemoryRoom = {
  id: string;
  code: string;
  phase: "lobby" | "suggesting";
  hostId: string | null;
  topN: number;
};

type InMemoryPlayer = {
  id: string;
  roomId: string;
  userId: string;
  name: string;
  isHost: boolean;
};

function createRepository(): RoomRepository & {
  rooms: InMemoryRoom[];
  players: InMemoryPlayer[];
} {
  const rooms: InMemoryRoom[] = [];
  const players: InMemoryPlayer[] = [];

  return {
    rooms,
    players,
    async roomCodeExists(code) {
      return rooms.some((room) => room.code === code);
    },
    async createRoom(input) {
      const room: InMemoryRoom = {
        id: `room-${rooms.length + 1}`,
        code: input.code,
        phase: "lobby",
        hostId: null,
        topN: 5,
      };

      rooms.push(room);
      return room;
    },
    async updateRoomHost(roomId, hostId) {
      const room = rooms.find((entry) => entry.id === roomId);
      if (!room) {
        throw new Error("Room not found while updating host.");
      }

      room.hostId = hostId;
    },
    async findRoomByCode(code) {
      return rooms.find((room) => room.code === code) ?? null;
    },
    async countPlayers(roomId) {
      return players.filter((player) => player.roomId === roomId).length;
    },
    async findPlayerByUserId(roomId, userId) {
      return (
        players.find(
          (player) => player.roomId === roomId && player.userId === userId,
        ) ?? null
      );
    },
    async findPlayerByName(roomId, name) {
      return (
        players.find(
          (player) =>
            player.roomId === roomId &&
            player.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
        ) ?? null
      );
    },
    async createPlayer(input) {
      const player: InMemoryPlayer = {
        id: `player-${players.length + 1}`,
        roomId: input.roomId,
        userId: input.userId,
        name: input.name,
        isHost: input.isHost,
      };

      players.push(player);
      return player;
    },
    async findPlayerById(playerId) {
      return players.find((player) => player.id === playerId) ?? null;
    },
    async updateRoomPhase(roomId, phase) {
      const room = rooms.find((entry) => entry.id === roomId);
      if (!room) {
        throw new Error("Room not found while updating phase.");
      }

      room.phase = phase;
      return room;
    },
  };
}

describe("room-service", () => {
  let repository: ReturnType<typeof createRepository>;

  beforeEach(() => {
    repository = createRepository();
  });

  test("createRoom creates the room and the host player", async () => {
    const result = await createRoom({
      name: "Leo",
      userId: "user-1",
      repository,
      randomCode: () => "AB12",
    });

    expect(result.code).toBe("AB12");
    expect(repository.rooms).toHaveLength(1);
    expect(repository.players).toHaveLength(1);
    expect(repository.players[0]).toMatchObject({
      name: "Leo",
      userId: "user-1",
      isHost: true,
    });
    expect(repository.rooms[0]?.hostId).toBe(repository.players[0]?.id);
  });

  test("joinRoom reattaches when the same auth user already belongs to the room", async () => {
    const created = await createRoom({
      name: "Leo",
      userId: "user-1",
      repository,
      randomCode: () => "AB12",
    });

    const joined = await joinRoom({
      code: created.code,
      name: "Another Name",
      userId: "user-1",
      repository,
    });

    expect(joined.playerId).toBe(created.playerId);
    expect(repository.players).toHaveLength(1);
  });

  test("joinRoom rejects duplicate names from different auth users", async () => {
    const created = await createRoom({
      name: "Leo",
      userId: "user-1",
      repository,
      randomCode: () => "AB12",
    });

    await expect(
      joinRoom({
        code: created.code,
        name: "Leo",
        userId: "user-2",
        repository,
      }),
    ).rejects.toThrow("This name is already in use in the room.");
  });

  test("joinRoom rejects non-lobby rooms", async () => {
    const created = await createRoom({
      name: "Leo",
      userId: "user-1",
      repository,
      randomCode: () => "AB12",
    });

    await joinRoom({
      code: created.code,
      name: "Maria",
      userId: "user-2",
      repository,
    });

    await startSuggesting({
      roomId: created.roomId,
      playerId: created.playerId,
      repository,
    });

    await expect(
      joinRoom({
        code: created.code,
        name: "Clara",
        userId: "user-3",
        repository,
      }),
    ).rejects.toThrow("This room has already started.");
  });

  test("startSuggesting only allows the host and requires at least 2 players", async () => {
    const created = await createRoom({
      name: "Leo",
      userId: "user-1",
      repository,
      randomCode: () => "AB12",
    });

    await expect(
      startSuggesting({
        roomId: created.roomId,
        playerId: created.playerId,
        repository,
      }),
    ).rejects.toThrow("At least 2 players are required to start.");

    const second = await joinRoom({
      code: created.code,
      name: "Maria",
      userId: "user-2",
      repository,
    });

    await expect(
      startSuggesting({
        roomId: created.roomId,
        playerId: second.playerId,
        repository,
      }),
    ).rejects.toThrow("Only the host can start the room.");

    const room = await startSuggesting({
      roomId: created.roomId,
      playerId: created.playerId,
      repository,
    });

    expect(room.phase).toBe("suggesting");
  });
});

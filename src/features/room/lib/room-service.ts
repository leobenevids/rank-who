import { createRoomSchema, joinRoomSchema } from "@/shared/schemas/room.schema";

import { generateUniqueRoomCode } from "@/features/room/lib/generate-room-code";

export type RoomPhase = "lobby" | "suggesting";

export type RoomRecord = {
  id: string;
  code: string;
  phase: RoomPhase;
  hostId: string | null;
  topN: number;
};

export type PlayerRecord = {
  id: string;
  roomId: string;
  userId: string;
  name: string;
  isHost: boolean;
};

export type RoomRepository = {
  roomCodeExists: (code: string) => Promise<boolean>;
  createRoom: (input: { code: string }) => Promise<RoomRecord>;
  updateRoomHost: (roomId: string, hostId: string) => Promise<void>;
  findRoomByCode: (code: string) => Promise<RoomRecord | null>;
  countPlayers: (roomId: string) => Promise<number>;
  findPlayerByUserId: (
    roomId: string,
    userId: string,
  ) => Promise<PlayerRecord | null>;
  findPlayerByName: (roomId: string, name: string) => Promise<PlayerRecord | null>;
  createPlayer: (input: {
    roomId: string;
    userId: string;
    name: string;
    isHost: boolean;
  }) => Promise<PlayerRecord>;
  findPlayerById: (playerId: string) => Promise<PlayerRecord | null>;
  updateRoomPhase: (roomId: string, phase: RoomPhase) => Promise<RoomRecord>;
};

type CreateRoomOptions = {
  name: string;
  userId: string;
  repository: RoomRepository;
  randomCode?: () => string;
};

type JoinRoomOptions = {
  code: string;
  name: string;
  userId: string;
  repository: RoomRepository;
};

type StartSuggestingOptions = {
  roomId: string;
  playerId: string;
  repository: RoomRepository;
};

export async function createRoom({
  name,
  userId,
  repository,
  randomCode,
}: CreateRoomOptions) {
  const parsed = createRoomSchema.parse({ name });
  const code = await generateUniqueRoomCode({
    exists: repository.roomCodeExists,
    randomCode,
  });

  const room = await repository.createRoom({ code });
  const player = await repository.createPlayer({
    roomId: room.id,
    userId,
    name: parsed.name,
    isHost: true,
  });

  await repository.updateRoomHost(room.id, player.id);

  return {
    code: room.code,
    roomId: room.id,
    playerId: player.id,
  };
}

export async function joinRoom({
  code,
  name,
  userId,
  repository,
}: JoinRoomOptions) {
  const parsed = joinRoomSchema.parse({ code, name });
  const room = await repository.findRoomByCode(parsed.code);

  if (!room) {
    throw new Error("Room not found.");
  }

  const existingPlayer = await repository.findPlayerByUserId(room.id, userId);

  if (existingPlayer) {
    return {
      code: room.code,
      roomId: room.id,
      playerId: existingPlayer.id,
    };
  }

  if (room.phase !== "lobby") {
    throw new Error("This room has already started.");
  }

  const duplicateName = await repository.findPlayerByName(room.id, parsed.name);

  if (duplicateName) {
    throw new Error("This name is already in use in the room.");
  }

  const playerCount = await repository.countPlayers(room.id);

  if (playerCount >= 10) {
    throw new Error("This room is full.");
  }

  const player = await repository.createPlayer({
    roomId: room.id,
    userId,
    name: parsed.name,
    isHost: false,
  });

  return {
    code: room.code,
    roomId: room.id,
    playerId: player.id,
  };
}

export async function startSuggesting({
  roomId,
  playerId,
  repository,
}: StartSuggestingOptions) {
  const player = await repository.findPlayerById(playerId);

  if (!player || player.roomId !== roomId) {
    throw new Error("Player not found in this room.");
  }

  if (!player.isHost) {
    throw new Error("Only the host can start the room.");
  }

  const playerCount = await repository.countPlayers(roomId);

  if (playerCount < 2) {
    throw new Error("At least 2 players are required to start.");
  }

  return repository.updateRoomPhase(roomId, "suggesting");
}

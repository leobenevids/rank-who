import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  PlayerRecord,
  RoomPhase,
  RoomRecord,
  RoomRepository,
} from "@/features/room/lib/room-service";

type RoomRow = {
  id: string;
  code: string;
  phase: RoomPhase;
  host_id: string | null;
  top_n: number;
};

type PlayerRow = {
  id: string;
  room_id: string;
  user_id: string;
  name: string;
  is_host: boolean;
};

function mapRoom(row: RoomRow): RoomRecord {
  return {
    id: row.id,
    code: row.code,
    phase: row.phase,
    hostId: row.host_id,
    topN: row.top_n,
  };
}

function mapPlayer(row: PlayerRow): PlayerRecord {
  return {
    id: row.id,
    roomId: row.room_id,
    userId: row.user_id,
    name: row.name,
    isHost: row.is_host,
  };
}

export function createRoomRepository(
  supabase: SupabaseClient,
): RoomRepository {
  return {
    async roomCodeExists(code) {
      const { data, error } = await supabase
        .from("rooms")
        .select("id")
        .eq("code", code)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      return Boolean(data);
    },
    async createRoom({ code }) {
      const { data, error } = await supabase
        .from("rooms")
        .insert({
          code,
          phase: "lobby",
          top_n: 5,
        })
        .select("id, code, phase, host_id, top_n")
        .single<RoomRow>();

      if (error) {
        throw new Error(error.message);
      }

      return mapRoom(data);
    },
    async updateRoomHost(roomId, hostId) {
      const { error } = await supabase
        .from("rooms")
        .update({ host_id: hostId })
        .eq("id", roomId);

      if (error) {
        throw new Error(error.message);
      }
    },
    async findRoomByCode(code) {
      const { data, error } = await supabase
        .from("rooms")
        .select("id, code, phase, host_id, top_n")
        .eq("code", code)
        .maybeSingle<RoomRow>();

      if (error) {
        throw new Error(error.message);
      }

      return data ? mapRoom(data) : null;
    },
    async countPlayers(roomId) {
      const { count, error } = await supabase
        .from("players")
        .select("id", { count: "exact", head: true })
        .eq("room_id", roomId);

      if (error) {
        throw new Error(error.message);
      }

      return count ?? 0;
    },
    async findPlayerByUserId(roomId, userId) {
      const { data, error } = await supabase
        .from("players")
        .select("id, room_id, user_id, name, is_host")
        .eq("room_id", roomId)
        .eq("user_id", userId)
        .maybeSingle<PlayerRow>();

      if (error) {
        throw new Error(error.message);
      }

      return data ? mapPlayer(data) : null;
    },
    async findPlayerByName(roomId, name) {
      const { data, error } = await supabase
        .from("players")
        .select("id, room_id, user_id, name, is_host")
        .eq("room_id", roomId)
        .ilike("name", name)
        .maybeSingle<PlayerRow>();

      if (error) {
        throw new Error(error.message);
      }

      return data ? mapPlayer(data) : null;
    },
    async createPlayer({ roomId, userId, name, isHost }) {
      const { data, error } = await supabase
        .from("players")
        .insert({
          room_id: roomId,
          user_id: userId,
          name,
          is_host: isHost,
        })
        .select("id, room_id, user_id, name, is_host")
        .single<PlayerRow>();

      if (error) {
        throw new Error(error.message);
      }

      return mapPlayer(data);
    },
    async findPlayerById(playerId) {
      const { data, error } = await supabase
        .from("players")
        .select("id, room_id, user_id, name, is_host")
        .eq("id", playerId)
        .maybeSingle<PlayerRow>();

      if (error) {
        throw new Error(error.message);
      }

      return data ? mapPlayer(data) : null;
    },
    async updateRoomPhase(roomId, phase) {
      const { data, error } = await supabase
        .from("rooms")
        .update({ phase })
        .eq("id", roomId)
        .select("id, code, phase, host_id, top_n")
        .single<RoomRow>();

      if (error) {
        throw new Error(error.message);
      }

      return mapRoom(data);
    },
  };
}

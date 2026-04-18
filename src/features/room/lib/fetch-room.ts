import type { SupabaseClient } from "@supabase/supabase-js";

import type { Phase, Player, Room } from "@/shared/types/game";

type RoomRow = {
  id: string;
  code: string;
  phase: Phase;
  theme: string | null;
  top_n: number;
  host_id: string;
  expires_at: string | null;
};

type PlayerRow = Player;

export async function fetchRoomByCode(
  supabase: SupabaseClient,
  code: string,
): Promise<Room | null> {
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id, code, phase, theme, top_n, host_id, expires_at")
    .eq("code", code)
    .maybeSingle<RoomRow>();

  if (roomError) {
    throw new Error(roomError.message);
  }

  if (!room) {
    return null;
  }

  const { data: players, error: playersError } = await supabase
    .from("players")
    .select("id, room_id, user_id, name, avatar, is_host, is_afk")
    .eq("room_id", room.id)
    .order("joined_at", { ascending: true })
    .returns<PlayerRow[]>();

  if (playersError) {
    throw new Error(playersError.message);
  }

  return {
    ...room,
    players: players ?? [],
  };
}

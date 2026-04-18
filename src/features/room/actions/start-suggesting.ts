"use server";

import { startSuggesting } from "@/features/room/lib/room-service";
import { createRoomRepository } from "@/features/room/lib/room-repository";
import { createClient } from "@/shared/lib/supabase/server";

export async function startSuggestingAction(input: {
  roomId: string;
  playerId: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error("Unable to authenticate the current player.");
  }

  if (!user) {
    throw new Error("Anonymous session required before starting the room.");
  }

  return startSuggesting({
    roomId: input.roomId,
    playerId: input.playerId,
    repository: createRoomRepository(supabase),
  });
}

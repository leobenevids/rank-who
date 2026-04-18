"use server";

import { joinRoom } from "@/features/room/lib/room-service";
import { createRoomRepository } from "@/features/room/lib/room-repository";
import { joinRoomSchema } from "@/shared/schemas/room.schema";
import { createClient } from "@/shared/lib/supabase/server";

export async function joinRoomAction(input: { name: string; code: string }) {
  const parsed = joinRoomSchema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error("Unable to authenticate the current player.");
  }

  if (!user) {
    throw new Error("Anonymous session required before joining a room.");
  }

  return joinRoom({
    code: parsed.code,
    name: parsed.name,
    userId: user.id,
    repository: createRoomRepository(supabase),
  });
}

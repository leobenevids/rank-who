"use server";

import { createRoom as createRoomService } from "@/features/room/lib/room-service";
import { createRoomRepository } from "@/features/room/lib/room-repository";
import { createRoomSchema } from "@/shared/schemas/room.schema";
import { createClient } from "@/shared/lib/supabase/server";

export async function createRoomAction(input: { name: string }) {
  const parsed = createRoomSchema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error("Unable to authenticate the current player.");
  }

  if (!user) {
    throw new Error("Anonymous session required before creating a room.");
  }

  return createRoomService({
    name: parsed.name,
    userId: user.id,
    repository: createRoomRepository(supabase),
  });
}

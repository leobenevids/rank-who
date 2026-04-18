import { notFound } from "next/navigation";

import { RoomPhaseRouter } from "@/features/room/components/room-phase-router";
import { fetchRoomByCode } from "@/features/room/lib/fetch-room";
import { createClient } from "@/shared/lib/supabase/server";

type RoomPageProps = {
  params: Promise<{ code: string }>;
};

export default async function RoomPage({ params }: RoomPageProps) {
  const { code } = await params;
  const supabase = await createClient();
  const room = await fetchRoomByCode(supabase, code.toUpperCase());

  if (!room) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const currentPlayerId =
    room.players?.find((player) => player.user_id === user?.id)?.id ?? null;

  return <RoomPhaseRouter currentPlayerId={currentPlayerId} room={room} />;
}

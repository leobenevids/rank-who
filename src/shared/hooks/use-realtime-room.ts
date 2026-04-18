"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchRoomByCode } from "@/features/room/lib/fetch-room";
import { createClient } from "@/shared/lib/supabase/client";
import type { Room } from "@/shared/types/game";

export function useRealtimeRoom(code: string, initialRoom: Room) {
  const queryClient = useQueryClient();
  const [supabase] = useState(() => createClient());

  const query = useQuery({
    queryKey: ["room", code],
    queryFn: () => fetchRoomByCode(supabase, code),
    initialData: initialRoom,
    staleTime: Number.POSITIVE_INFINITY,
  });

  useEffect(() => {
    const channel = supabase
      .channel(`room:${code}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rooms",
        },
        () => {
          void queryClient.invalidateQueries({ queryKey: ["room", code] });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `room_id=eq.${initialRoom.id}`,
        },
        () => {
          void queryClient.invalidateQueries({ queryKey: ["room", code] });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [code, initialRoom.id, queryClient, supabase]);

  return query;
}

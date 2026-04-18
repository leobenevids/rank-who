"use client";

import { useState, useTransition } from "react";

import { startSuggestingAction } from "@/features/room/actions/start-suggesting";
import { LobbyScreen } from "@/features/room/components/lobby-screen";
import { PixelBox } from "@/shared/components/ui/pixel-box";
import { useRealtimeRoom } from "@/shared/hooks/use-realtime-room";
import type { Room } from "@/shared/types/game";

type LobbyContainerProps = {
  initialRoom: Room;
  currentPlayerId: string | null;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected lobby error.";
}

export function LobbyContainer({
  initialRoom,
  currentPlayerId,
}: LobbyContainerProps) {
  const [isStarting, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const roomQuery = useRealtimeRoom(initialRoom.code, initialRoom);
  const room = roomQuery.data ?? initialRoom;

  if (room.phase !== "lobby") {
    return (
      <main className="screen min-h-screen px-4 py-10 md:px-8">
        <div className="mx-auto max-w-4xl">
          <PixelBox accent className="flex flex-col gap-3">
            <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--green)]">
              Phase Advanced
            </span>
            <h1 className="text-2xl leading-relaxed md:text-4xl">
              The room already moved to {room.phase}.
            </h1>
            <p className="text-lg text-[var(--paper)]/90 md:text-2xl">
              Sprint 1 only implements the lobby surface. The next phase will be
              added in the following sprint.
            </p>
          </PixelBox>
        </div>
      </main>
    );
  }

  return (
    <LobbyScreen
      currentPlayerId={currentPlayerId}
      error={error}
      isStarting={isStarting}
      onStart={() => {
        if (!currentPlayerId) {
          setError("Join the room before trying to start it.");
          return;
        }

        setError(null);
        startTransition(() => {
          void (async () => {
            try {
              await startSuggestingAction({
                roomId: room.id,
                playerId: currentPlayerId,
              });
            } catch (caughtError) {
              setError(getErrorMessage(caughtError));
            }
          })();
        });
      }}
      room={room}
    />
  );
}

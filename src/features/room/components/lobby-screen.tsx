import { PixelBox } from "@/shared/components/ui/pixel-box";
import { PixelBtn } from "@/shared/components/ui/pixel-btn";
import type { Room } from "@/shared/types/game";

import { PlayerList } from "@/features/room/components/player-list";
import { RoomCodeChip } from "@/features/room/components/room-code-chip";

type LobbyScreenProps = {
  room: Room;
  currentPlayerId: string | null;
  isStarting: boolean;
  onStart: () => void;
  error?: string | null;
};

export function LobbyScreen({
  room,
  currentPlayerId,
  isStarting,
  onStart,
  error = null,
}: LobbyScreenProps) {
  const currentPlayer =
    room.players?.find((player) => player.id === currentPlayerId) ?? null;
  const canStart = Boolean(currentPlayer?.is_host) && (room.players?.length ?? 0) >= 2;

  return (
    <main className="screen min-h-screen px-4 py-10 md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <PixelBox accent className="flex flex-col gap-3">
          <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--green)]">
            Lobby
          </span>
          <h1 className="text-2xl leading-relaxed md:text-4xl">
            Waiting for the room to fill up.
          </h1>
          <p className="max-w-3xl text-lg text-[var(--paper)]/90 md:text-2xl">
            Everyone joins with an anonymous auth identity, but the lobby still
            feels like a casual room shared by friends.
          </p>
        </PixelBox>

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col gap-6">
            <RoomCodeChip code={room.code} />

            <PixelBox className="flex flex-col gap-4">
              <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--yellow)]">
                Match Status
              </span>
              <p className="text-lg md:text-2xl">
                {room.players?.length ?? 0} player(s) connected
              </p>
              {currentPlayer?.is_host ? (
                <PixelBtn
                  disabled={!canStart}
                  loading={isStarting}
                  onClick={onStart}
                  type="button"
                >
                  Start Game
                </PixelBtn>
              ) : (
                <p className="text-lg md:text-2xl">
                  Waiting for the host to start the game.
                </p>
              )}

              {error ? (
                <p className="text-lg text-[var(--red)] md:text-2xl">{error}</p>
              ) : null}
            </PixelBox>
          </div>

          <PixelBox className="flex flex-col gap-4">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--blue)]">
                Players
              </p>
              <h2 className="text-xl leading-relaxed md:text-3xl">
                Everyone in the room updates in realtime.
              </h2>
            </div>

            <PlayerList
              currentPlayerId={currentPlayerId}
              players={room.players ?? []}
            />
          </PixelBox>
        </div>
      </div>
    </main>
  );
}

import { LobbyContainer } from "@/features/room/components/lobby-container";
import { PixelBox } from "@/shared/components/ui/pixel-box";
import type { Room } from "@/shared/types/game";

type RoomPhaseRouterProps = {
  room: Room;
  currentPlayerId: string | null;
};

export function RoomPhaseRouter({
  room,
  currentPlayerId,
}: RoomPhaseRouterProps) {
  if (room.phase === "lobby") {
    return (
      <LobbyContainer currentPlayerId={currentPlayerId} initialRoom={room} />
    );
  }

  return (
    <main className="screen min-h-screen px-4 py-10 md:px-8">
      <div className="mx-auto max-w-4xl">
        <PixelBox accent className="flex flex-col gap-3">
          <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--green)]">
            Phase Placeholder
          </span>
          <h1 className="text-2xl leading-relaxed md:text-4xl">
            The room is currently in {room.phase}.
          </h1>
          <p className="text-lg text-[var(--paper)]/90 md:text-2xl">
            Sprint 1 only ships the lobby. This route is already phase-aware so
            Sprint 2 can plug into the same page without rewiring routing.
          </p>
        </PixelBox>
      </div>
    </main>
  );
}

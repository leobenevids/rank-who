import type { Player } from "@/shared/types/game";

type PlayerListProps = {
  players: Player[];
  currentPlayerId: string | null;
};

export function PlayerList({ players, currentPlayerId }: PlayerListProps) {
  return (
    <ul className="grid gap-3">
      {players.map((player) => {
        const isCurrent = player.id === currentPlayerId;

        return (
          <li
            key={player.id}
            className="flex items-center justify-between gap-4 border-4 border-[var(--ink)] bg-[var(--cream)] px-4 py-3 text-[var(--ink)] shadow-[4px_4px_0_var(--ink)]"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{player.avatar ?? "👾"}</span>
              <div className="flex flex-col">
                <span className="text-lg md:text-2xl">{player.name}</span>
                <div className="flex gap-2">
                  {player.is_host ? (
                    <span className="pixel-label text-[var(--yellow)]">HOST</span>
                  ) : null}
                  {isCurrent ? (
                    <span className="pixel-label text-[var(--green)]">YOU</span>
                  ) : null}
                </div>
              </div>
            </div>

            <span className="text-lg tracking-[0.3em] text-[var(--red)]">
              ♥♥♥
            </span>
          </li>
        );
      })}
    </ul>
  );
}

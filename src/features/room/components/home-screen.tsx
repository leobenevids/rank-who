import { PixelBox } from "@/shared/components/ui/pixel-box";
import { PixelBtn } from "@/shared/components/ui/pixel-btn";
import { PixelInput } from "@/shared/components/ui/pixel-input";

type HomeScreenProps = {
  createName: string;
  joinName: string;
  joinCode: string;
  disabled: boolean;
  createError: string | null;
  joinError: string | null;
  authStatus?: "checking" | "ready" | "error";
  authError?: string | null;
  onCreateSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onJoinSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCreateNameChange: (value: string) => void;
  onJoinNameChange: (value: string) => void;
  onJoinCodeChange: (value: string) => void;
};

export function HomeScreen({
  createName,
  joinName,
  joinCode,
  disabled,
  createError,
  joinError,
  authStatus = "ready",
  authError = null,
  onCreateSubmit,
  onJoinSubmit,
  onCreateNameChange,
  onJoinNameChange,
  onJoinCodeChange,
}: HomeScreenProps) {
  const statusLabel =
    authStatus === "checking"
      ? "Connecting anonymous player session..."
      : authStatus === "error"
        ? authError ?? "Unable to initialize authentication."
        : "Anonymous session ready.";

  return (
    <main className="screen min-h-screen px-4 py-10 md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <PixelBox accent className="flex flex-col gap-3">
          <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--green)]">
            Sprint 1
          </span>
          <h1 className="max-w-3xl text-2xl leading-relaxed md:text-4xl">
            Create a room, join by code, and bring the lobby to life.
          </h1>
          <p className="max-w-2xl text-lg text-[var(--paper)]/90 md:text-2xl">
            Anonymous auth is established before any room action so identity,
            RLS, and reconnect stay consistent.
          </p>
        </PixelBox>

        <div className="grid gap-6 lg:grid-cols-2">
          <PixelBox className="flex flex-col gap-4">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--blue)]">
                New Match
              </p>
              <h2 className="text-xl leading-relaxed md:text-3xl">
                Create Room
              </h2>
            </div>

            <form
              className="flex flex-col gap-4"
              data-testid="create-room-form"
              onSubmit={onCreateSubmit}
            >
              <label className="flex flex-col gap-2">
                <span className="pixel-label">Player Name</span>
                <PixelInput
                  disabled={disabled}
                  onChange={(event) => onCreateNameChange(event.target.value)}
                  placeholder="LEO"
                  value={createName}
                />
              </label>

              {createError ? (
                <p className="text-lg text-[var(--red)] md:text-2xl">
                  {createError}
                </p>
              ) : null}

              <PixelBtn disabled={disabled} fullWidth type="submit">
                Create Room
              </PixelBtn>
            </form>
          </PixelBox>

          <PixelBox className="flex flex-col gap-4">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--yellow)]">
                Existing Match
              </p>
              <h2 className="text-xl leading-relaxed md:text-3xl">Join Room</h2>
            </div>

            <form
              className="flex flex-col gap-4"
              data-testid="join-room-form"
              onSubmit={onJoinSubmit}
            >
              <label className="flex flex-col gap-2">
                <span className="pixel-label">Player Name</span>
                <PixelInput
                  disabled={disabled}
                  onChange={(event) => onJoinNameChange(event.target.value)}
                  placeholder="MARIA"
                  value={joinName}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="pixel-label">Room Code</span>
                <PixelInput
                  disabled={disabled}
                  maxLength={4}
                  onChange={(event) => onJoinCodeChange(event.target.value)}
                  placeholder="AB12"
                  value={joinCode}
                />
              </label>

              {joinError ? (
                <p className="text-lg text-[var(--red)] md:text-2xl">
                  {joinError}
                </p>
              ) : null}

              <PixelBtn disabled={disabled} fullWidth type="submit" variant="secondary">
                Join Room
              </PixelBtn>
            </form>
          </PixelBox>
        </div>

        <PixelBox className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--green)]">
            Session Status
          </span>
          <p className="text-lg md:text-2xl">{statusLabel}</p>
        </PixelBox>
      </div>
    </main>
  );
}

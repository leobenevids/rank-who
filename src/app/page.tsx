import { PixelBox } from "@/shared/components/ui/pixel-box";
import { PixelBtn } from "@/shared/components/ui/pixel-btn";
import { PixelInput } from "@/shared/components/ui/pixel-input";
import { ProgressBlocks } from "@/shared/components/ui/progress-blocks";

export default function Home() {
  return (
    <main className="screen min-h-screen px-4 py-10 md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <PixelBox accent className="flex flex-col gap-3">
          <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--green)]">
            Sprint 0
          </span>
          <h1 className="max-w-3xl text-2xl leading-relaxed md:text-4xl">
            RankWho is ready for the first playable sprint.
          </h1>
          <p className="max-w-2xl text-lg text-[var(--paper)]/90 md:text-2xl">
            This home screen is a smoke-test shell for the shared runtime,
            pixel UI primitives, and project structure.
          </p>
        </PixelBox>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <PixelBox className="flex flex-col gap-5">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--blue)]">
                Lobby Preview
              </p>
              <h2 className="text-xl leading-relaxed md:text-3xl">
                Shared primitives are already wired into the app shell.
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="pixel-label">Player Name</span>
                <PixelInput placeholder="LEO" />
              </label>
              <label className="flex flex-col gap-2">
                <span className="pixel-label">Room Code</span>
                <PixelInput placeholder="AB12" maxLength={4} />
              </label>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <PixelBtn type="button">Create Room</PixelBtn>
              <PixelBtn type="button" variant="secondary">
                Join Room
              </PixelBtn>
            </div>
          </PixelBox>

          <PixelBox className="flex flex-col gap-5">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--yellow)]">
                Readiness
              </p>
              <h2 className="text-xl leading-relaxed md:text-3xl">
                Setup progress is visible from the very first screen.
              </h2>
            </div>

            <ProgressBlocks total={6} value={4} />

            <ul className="space-y-2 text-lg md:text-2xl">
              <li>01. Next.js 16 app scaffolded</li>
              <li>02. Query provider mounted</li>
              <li>03. Supabase helpers scaffolded</li>
              <li>04. Pixel UI primitives ready</li>
              <li>05. Feature folders prepared</li>
              <li>06. Game sprint starts next</li>
            </ul>
          </PixelBox>
        </div>
      </div>
    </main>
  );
}

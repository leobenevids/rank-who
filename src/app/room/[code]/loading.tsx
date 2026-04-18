import { PixelBox } from "@/shared/components/ui/pixel-box";
import { ProgressBlocks } from "@/shared/components/ui/progress-blocks";

export default function RoomLoading() {
  return (
    <main className="screen min-h-screen px-4 py-10 md:px-8">
      <div className="mx-auto max-w-4xl">
        <PixelBox accent className="flex flex-col gap-4">
          <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--green)]">
            Loading Room
          </span>
          <h1 className="text-2xl leading-relaxed md:text-4xl">
            Syncing the lobby state...
          </h1>
          <ProgressBlocks total={6} value={3} />
        </PixelBox>
      </div>
    </main>
  );
}

import { describe, expect, test } from "vitest";

import { generateUniqueRoomCode } from "@/features/room/lib/generate-room-code";

describe("generateUniqueRoomCode", () => {
  test("returns the first available 4 character code", async () => {
    const result = await generateUniqueRoomCode({
      exists: async (code) => code === "AAAA",
      randomCode: () => "AB12",
      maxAttempts: 5,
    });

    expect(result).toBe("AB12");
  });

  test("retries collisions until it finds a free code", async () => {
    let calls = 0;
    const sequence = ["AAAA", "AAAA", "BC34"];

    const result = await generateUniqueRoomCode({
      exists: async (code) => code === "AAAA",
      randomCode: () => {
        const value = sequence[calls] ?? "BC34";
        calls += 1;
        return value;
      },
      maxAttempts: 5,
    });

    expect(result).toBe("BC34");
    expect(calls).toBe(3);
  });

  test("throws when all attempts collide", async () => {
    await expect(
      generateUniqueRoomCode({
        exists: async () => true,
        randomCode: () => "AAAA",
        maxAttempts: 2,
      }),
    ).rejects.toThrow("Unable to generate a unique room code.");
  });
});

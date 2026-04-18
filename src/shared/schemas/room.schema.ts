import { z } from "zod";

const displayNameSchema = z
  .string()
  .trim()
  .min(1, "Name is required.")
  .max(20, "Name must be at most 20 characters.");

export const createRoomSchema = z.object({
  name: displayNameSchema,
});

export const joinRoomSchema = z.object({
  name: displayNameSchema,
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{4}$/, "Room code must be 4 letters or numbers."),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type JoinRoomInput = z.infer<typeof joinRoomSchema>;

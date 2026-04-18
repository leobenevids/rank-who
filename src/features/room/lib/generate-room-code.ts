const DEFAULT_MAX_ATTEMPTS = 10;
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export type GenerateUniqueRoomCodeOptions = {
  exists: (code: string) => Promise<boolean>;
  randomCode?: () => string;
  maxAttempts?: number;
};

function createRandomCode() {
  let code = "";

  for (let index = 0; index < 4; index += 1) {
    const offset = Math.floor(Math.random() * CODE_ALPHABET.length);
    code += CODE_ALPHABET[offset];
  }

  return code;
}

export async function generateUniqueRoomCode({
  exists,
  randomCode = createRandomCode,
  maxAttempts = DEFAULT_MAX_ATTEMPTS,
}: GenerateUniqueRoomCodeOptions) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate = randomCode();
    const collision = await exists(candidate);

    if (!collision) {
      return candidate;
    }
  }

  throw new Error("Unable to generate a unique room code.");
}

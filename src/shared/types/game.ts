export type Phase =
  | "lobby"
  | "suggesting"
  | "picking"
  | "ranking"
  | "guessing"
  | "results"
  | "expired";

export interface Player {
  id: string;
  room_id: string;
  name: string;
  avatar: string | null;
  is_host: boolean;
  is_afk: boolean;
}

export interface Room {
  id: string;
  code: string;
  phase: Phase;
  theme: string | null;
  top_n: number;
  host_id: string;
  expires_at: string | null;
  preset_themes?: string[];
  players?: Player[];
}

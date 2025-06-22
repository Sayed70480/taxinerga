import { atom } from "jotai";

export const adminAtom = atom<{ username: string; role: string } | null>(null);

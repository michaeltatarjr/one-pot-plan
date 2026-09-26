import type { AppState } from "../data/types";
import { sanitizeState } from "./storage";

export const BACKUP_APP = "one-pot-plan";
export const BACKUP_VERSION = 1;
export const MAX_BACKUP_BYTES = 1_000_000;

export type ImportResult = { ok: true; state: AppState } | { ok: false; error: string };

export function exportBackup(state: AppState, now: Date = new Date()): string {
  return JSON.stringify(
    { app: BACKUP_APP, version: BACKUP_VERSION, exportedAt: now.toISOString(), state: sanitizeState(state) },
    null,
    2,
  );
}

export function importBackup(text: string): ImportResult {
  if (text.length > MAX_BACKUP_BYTES) {
    return { ok: false, error: "That file is too large to be a backup from this app." };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "That file is not valid JSON." };
  }
  if (
    parsed === null ||
    typeof parsed !== "object" ||
    Array.isArray(parsed) ||
    (parsed as Record<string, unknown>).app !== BACKUP_APP
  ) {
    return { ok: false, error: "That file is not a One-Pot Plan backup." };
  }
  const record = parsed as Record<string, unknown>;
  if (record.version !== BACKUP_VERSION) {
    return { ok: false, error: "That backup is from an unsupported version." };
  }
  return { ok: true, state: sanitizeState(record.state) };
}

export function backupFileName(now: Date = new Date()): string {
  return `one-pot-plan-backup-${now.toISOString().slice(0, 10)}.json`;
}

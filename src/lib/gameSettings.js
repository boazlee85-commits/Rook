import { VERSIONS } from "@/lib/gameVersions";

const STORAGE_KEY = "rook_settings_v2";

function clampNumber(value, fallback, min, max, step = 1) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;

  const clamped = Math.min(max, Math.max(min, parsed));
  return Math.round(clamped / step) * step;
}

export function getRookSettings() {
  const fallbackVersion = "standard";

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const stored = raw ? JSON.parse(raw) : {};
    const version = VERSIONS[stored.version] ? stored.version : fallbackVersion;
    const base = VERSIONS[version];

    return {
      version,
      winScore: clampNumber(stored.winScore, base.winScore, 100, 1000, 10),
      minBid: clampNumber(stored.minBid, base.minBid, 50, base.maxBid, 5),
      bidIncrement: clampNumber(stored.bidIncrement, base.bidIncrement, 5, 20, 5),
    };
  } catch {
    const base = VERSIONS[fallbackVersion];
    return {
      version: fallbackVersion,
      winScore: base.winScore,
      minBid: base.minBid,
      bidIncrement: base.bidIncrement,
    };
  }
}

export function saveRookSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function getMergedRookConfig() {
  const settings = getRookSettings();
  const base = VERSIONS[settings.version];

  return {
    ...base,
    winScore: settings.winScore,
    minBid: Math.min(settings.minBid, base.maxBid),
    bidIncrement: settings.bidIncrement,
  };
}

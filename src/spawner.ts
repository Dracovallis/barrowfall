import { EnemyType, SHAMBLER, SKITTER, BRUTE } from './enemy';

/** Difficulty curve: returns spawns/sec at time t (seconds). Ramps every 15s. */
export function spawnRate(t: number): number {
  const tier = Math.floor(t / 15);
  return 0.8 + tier * 0.45;
}

/** Enemy HP scales +10% per minute. */
export function hpScale(t: number): number {
  return 1 + 0.1 * (t / 60);
}

export function pickType(t: number): EnemyType {
  const r = Math.random();
  if (t >= 75 && r < 0.12) return BRUTE;
  if (t >= 30 && r < 0.45) return SKITTER;
  return SHAMBLER;
}

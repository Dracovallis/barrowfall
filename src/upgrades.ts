import { Hero } from './hero';

export interface Upgrade {
  name: string;
  desc: string;
  icon: string;
  apply: (h: Hero) => void;
}

export const UPGRADES: Upgrade[] = [
  { name: 'Swift Feet', desc: '+25% move speed', icon: '👟', apply: (h) => { h.speed *= 1.25; } },
  { name: 'Split Shot', desc: '+1 projectile, fires at the next-nearest enemy', icon: '🔱', apply: (h) => { h.projectiles += 1; } },
  { name: 'Quick Hands', desc: '+30% fire rate', icon: '⚡', apply: (h) => { h.fireInterval /= 1.3; } },
  { name: 'Sharpened', desc: '+1 damage', icon: '🗡️', apply: (h) => { h.damage += 1; } },
  { name: 'Thick Skin', desc: '+25 max HP and heal 25', icon: '❤️', apply: (h) => { h.maxHp += 25; h.hp = Math.min(h.maxHp, h.hp + 25); } },
  { name: 'Magnet', desc: '+50% pickup radius', icon: '🧲', apply: (h) => { h.magnet *= 1.5; } },
  { name: 'Piercing', desc: 'Projectiles pierce 1 extra enemy', icon: '➶', apply: (h) => { h.pierce += 1; } },
  { name: 'Second Wind', desc: 'Regenerate 1 HP every 2s', icon: '🌿', apply: (h) => { h.regen += 0.5; } },
];

export function pickThree(): Upgrade[] {
  const pool = [...UPGRADES];
  const out: Upgrade[] = [];
  while (out.length < 3 && pool.length) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return out;
}

import * as THREE from 'three';
import { Hero, ARENA_RADIUS } from './hero';
import { Enemy } from './enemy';
import { Projectile } from './projectile';
import { Gem } from './gem';
import { Pool } from './pool';
import { spawnRate, hpScale, pickType } from './spawner';
import * as hud from './hud';

export type State = 'title' | 'playing' | 'levelup' | 'dead';

export function xpToLevel(level: number) {
  return 5 + (level - 1) * 4;
}

export class Game {
  state: State = 'title';
  hero: Hero;
  enemies: Pool<Enemy>;
  projectiles: Pool<Projectile>;
  gems: Pool<Gem>;
  time = 0;
  kills = 0;
  level = 1;
  xp = 0;
  spawnAcc = 0;
  fireAcc = 0;
  shake = 0;
  hitCooldown = 0;

  constructor(public scene: THREE.Scene) {
    this.hero = new Hero(scene);
    this.enemies = new Pool(() => new Enemy(scene), 80);
    this.projectiles = new Pool(() => new Projectile(scene), 60);
    this.gems = new Pool(() => new Gem(scene), 120);
  }

  start() {
    this.hero.reset();
    this.enemies.forEach((e) => e.kill());
    this.projectiles.forEach((p) => p.kill());
    this.gems.forEach((g) => g.kill());
    this.time = 0;
    this.kills = 0;
    this.level = 1;
    this.xp = 0;
    this.spawnAcc = 0;
    this.fireAcc = 0;
    this.shake = 0;
    this.hitCooldown = 0;
    this.state = 'playing';
    hud.hideOverlay();
    this.syncHud();
  }

  die() {
    this.state = 'dead';
    const m = Math.floor(this.time / 60), s = Math.floor(this.time % 60);
    hud.showOverlay(`
      <div class="panel">
        <h2>You fell.</h2>
        <p class="big">Survived ${m}:${s.toString().padStart(2, '0')}</p>
        <p>${this.kills} kills &middot; Level ${this.level}</p>
        <button id="restart">Restart</button>
      </div>`);
    hud.overlay.querySelector('#restart')!.addEventListener('click', () => this.start());
  }

  update(dt: number) {
    if (this.state !== 'playing') return;
    this.time += dt;
    this.hero.update(dt);
    const hp = this.hero.mesh.position;

    // Spawning
    this.spawnAcc += spawnRate(this.time) * dt;
    while (this.spawnAcc >= 1) {
      this.spawnAcc -= 1;
      const a = Math.random() * Math.PI * 2;
      this.enemies.get().spawn(pickType(this.time), Math.cos(a) * ARENA_RADIUS, Math.sin(a) * ARENA_RADIUS, hpScale(this.time));
    }

    // Auto-attack: fire at the N nearest enemies
    this.fireAcc += dt;
    if (this.fireAcc >= this.hero.fireInterval) {
      this.fireAcc = 0;
      this.fire();
    }

    // Projectiles vs enemies
    this.projectiles.forEach((p) => {
      p.update(dt);
      if (!p.active) return;
      this.enemies.forEach((e) => {
        if (!p.active || e.dying > 0 || p.hitIds.has(e.id)) return;
        const dx = e.pos.x - p.pos.x, dz = e.pos.z - p.pos.z;
        if (dx * dx + dz * dz < (e.type.radius + 0.25) ** 2) {
          p.hitIds.add(e.id);
          if (e.hit(p.damage)) this.onKill(e);
          if (p.hitIds.size > p.pierce) p.kill();
        }
      });
    });

    // Enemies chase + contact damage
    this.hitCooldown -= dt;
    this.enemies.forEach((e) => {
      const touching = e.update(dt, hp);
      if (touching && this.hitCooldown <= 0) {
        this.hitCooldown = 0.4;
        this.hero.hp -= e.type.damage;
        this.shake = 0.25;
        if (e.type.knockback > 0) {
          const dx = hp.x - e.pos.x, dz = hp.z - e.pos.z;
          const d = Math.hypot(dx, dz) || 1;
          hp.x += (dx / d) * e.type.knockback;
          hp.z += (dz / d) * e.type.knockback;
          this.hero.clamp();
        }
        if (this.hero.hp <= 0) this.die();
      }
    });

    // Gems
    this.gems.forEach((g) => {
      if (g.update(dt, hp, this.hero.magnet)) {
        g.kill();
        this.xp += g.xp;
      }
    });
    if (this.xp >= xpToLevel(this.level)) {
      this.xp -= xpToLevel(this.level);
      this.level++;
    }

    this.shake = Math.max(0, this.shake - dt);
    this.syncHud();
  }

  fire() {
    const hp = this.hero.mesh.position;
    // Pick N nearest enemies (small N, so a simple partial sort is fine)
    const targets: { e: Enemy; d: number }[] = [];
    this.enemies.forEach((e) => {
      if (e.dying > 0) return;
      const d = (e.pos.x - hp.x) ** 2 + (e.pos.z - hp.z) ** 2;
      if (targets.length < this.hero.projectiles) {
        targets.push({ e, d });
        targets.sort((a, b) => a.d - b.d);
      } else if (d < targets[targets.length - 1].d) {
        targets[targets.length - 1] = { e, d };
        targets.sort((a, b) => a.d - b.d);
      }
    });
    for (const t of targets) {
      const dx = t.e.pos.x - hp.x, dz = t.e.pos.z - hp.z;
      const d = Math.sqrt(t.d) || 1;
      this.projectiles.get().fire(hp.x, hp.z, dx / d, dz / d, this.hero.damage, this.hero.pierce);
    }
  }

  onKill(e: Enemy) {
    this.kills++;
    this.gems.get().drop(e.pos.x, e.pos.z, e.type.xp);
  }

  syncHud() {
    hud.setHp(this.hero.hp, this.hero.maxHp);
    hud.setXp(this.xp, xpToLevel(this.level), this.level);
    hud.setStats(this.time, this.kills);
  }
}

import * as THREE from 'three';
import { Hero, ARENA_RADIUS } from './hero';
import { Enemy } from './enemy';
import { Pool } from './pool';
import { spawnRate, hpScale, pickType } from './spawner';
import * as hud from './hud';

export type State = 'title' | 'playing' | 'levelup' | 'dead';

export class Game {
  state: State = 'title';
  hero: Hero;
  enemies: Pool<Enemy>;
  time = 0;
  kills = 0;
  spawnAcc = 0;
  shake = 0;
  hitCooldown = 0;

  constructor(public scene: THREE.Scene) {
    this.hero = new Hero(scene);
    this.enemies = new Pool(() => new Enemy(scene), 60);
  }

  start() {
    this.hero.reset();
    this.enemies.forEach((e) => e.kill());
    this.time = 0;
    this.kills = 0;
    this.spawnAcc = 0;
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
        <p>${this.kills} kills</p>
        <button id="restart">Restart</button>
      </div>`);
    hud.overlay.querySelector('#restart')!.addEventListener('click', () => this.start());
  }

  update(dt: number) {
    if (this.state !== 'playing') return;
    this.time += dt;
    this.hero.update(dt);

    // Spawning
    this.spawnAcc += spawnRate(this.time) * dt;
    while (this.spawnAcc >= 1) {
      this.spawnAcc -= 1;
      const a = Math.random() * Math.PI * 2;
      this.enemies.get().spawn(pickType(this.time), Math.cos(a) * ARENA_RADIUS, Math.sin(a) * ARENA_RADIUS, hpScale(this.time));
    }

    // Enemies chase + contact damage
    this.hitCooldown -= dt;
    const hp = this.hero.mesh.position;
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
        }
        if (this.hero.hp <= 0) this.die();
      }
    });

    this.shake = Math.max(0, this.shake - dt);
    this.syncHud();
  }

  syncHud() {
    hud.setHp(this.hero.hp, this.hero.maxHp);
    hud.setStats(this.time, this.kills);
  }
}

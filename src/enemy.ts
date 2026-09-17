import * as THREE from 'three';

export interface EnemyType {
  name: string;
  hp: number;
  speed: number;
  radius: number;
  damage: number;
  color: number;
  knockback: number;
  xp: number;
  geo: () => THREE.BufferGeometry;
}

export const SHAMBLER: EnemyType = {
  name: 'shambler', hp: 3, speed: 3.2, radius: 0.6, damage: 10, color: 0xe8e2d0, knockback: 0, xp: 1,
  geo: () => new THREE.BoxGeometry(1, 1.4, 1),
};
export const SKITTER: EnemyType = {
  name: 'skitter', hp: 1, speed: 7.5, radius: 0.4, damage: 6, color: 0x9bff3d, knockback: 0, xp: 1,
  geo: () => new THREE.SphereGeometry(0.45, 6, 4),
};
export const BRUTE: EnemyType = {
  name: 'brute', hp: 12, speed: 2.2, radius: 1.2, damage: 25, color: 0xa63a2e, knockback: 6, xp: 4,
  geo: () => new THREE.BoxGeometry(2.2, 2.6, 2.2),
};

const geoCache = new Map<EnemyType, THREE.BufferGeometry>();
function geoFor(t: EnemyType) {
  let g = geoCache.get(t);
  if (!g) { g = t.geo(); geoCache.set(t, g); }
  return g;
}

export class Enemy {
  static nextId = 1;
  id = 0;
  active = false;
  mesh: THREE.Mesh;
  mat: THREE.MeshStandardMaterial;
  type: EnemyType = SHAMBLER;
  hp = 1;
  maxHp = 1;
  flash = 0;
  dying = 0; // >0 while popping out
  vx = 0; vz = 0; // knockback velocity

  constructor(scene: THREE.Scene) {
    this.mat = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true });
    this.mesh = new THREE.Mesh(geoFor(SHAMBLER), this.mat);
    this.mesh.castShadow = true;
    this.mesh.visible = false;
    scene.add(this.mesh);
  }

  spawn(type: EnemyType, x: number, z: number, hpScale: number) {
    this.active = true;
    this.id = Enemy.nextId++;
    this.type = type;
    this.mesh.geometry = geoFor(type);
    this.mat.color.setHex(type.color);
    this.mat.emissive.setHex(0x000000);
    this.hp = this.maxHp = Math.ceil(type.hp * hpScale);
    this.flash = 0;
    this.dying = 0;
    this.vx = this.vz = 0;
    this.mesh.position.set(x, type.radius + 0.1, z);
    this.mesh.scale.setScalar(1);
    this.mesh.visible = true;
  }

  kill() {
    this.active = false;
    this.mesh.visible = false;
  }

  /** Returns true if this enemy touches the hero this step. */
  update(dt: number, heroPos: THREE.Vector3): boolean {
    const p = this.mesh.position;
    if (this.dying > 0) {
      this.dying -= dt;
      const s = Math.max(0, this.dying / 0.18);
      this.mesh.scale.setScalar(s);
      if (this.dying <= 0) this.kill();
      return false;
    }
    let dx = heroPos.x - p.x, dz = heroPos.z - p.z;
    const d = Math.hypot(dx, dz) || 1;
    dx /= d; dz /= d;
    p.x += dx * this.type.speed * dt + this.vx * dt;
    p.z += dz * this.type.speed * dt + this.vz * dt;
    this.vx *= 0.85; this.vz *= 0.85;
    this.mesh.rotation.y = Math.atan2(dx, dz);
    if (this.flash > 0) {
      this.flash -= dt;
      if (this.flash <= 0) this.mat.emissive.setHex(0x000000);
    }
    return d < this.type.radius + 0.6;
  }

  hit(dmg: number): boolean {
    this.hp -= dmg;
    this.flash = 0.08;
    this.mat.emissive.setHex(0xffffff);
    if (this.hp <= 0 && this.dying <= 0) {
      this.dying = 0.18;
      return true;
    }
    return false;
  }

  get pos() { return this.mesh.position; }
}

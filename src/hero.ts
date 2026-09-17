import * as THREE from 'three';
import { axis } from './input';

export const ARENA_RADIUS = 28;

export class Hero {
  mesh: THREE.Mesh;
  speed = 9;
  radius = 0.6;
  hp = 100;
  maxHp = 100;

  constructor(scene: THREE.Scene) {
    const geo = new THREE.CapsuleGeometry(0.5, 0.9, 4, 10);
    const mat = new THREE.MeshStandardMaterial({ color: 0x2ec4b6, flatShading: true });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.castShadow = true;
    this.mesh.position.set(0, 0.95, 0);
    scene.add(this.mesh);
  }

  update(dt: number) {
    const a = axis();
    const p = this.mesh.position;
    p.x += a.x * this.speed * dt;
    p.z += a.z * this.speed * dt;
    const d = Math.hypot(p.x, p.z);
    const max = ARENA_RADIUS - this.radius;
    if (d > max) { p.x *= max / d; p.z *= max / d; }
    if (a.x !== 0 || a.z !== 0) this.mesh.rotation.y = Math.atan2(a.x, a.z);
  }

  reset() {
    this.mesh.position.set(0, 0.95, 0);
    this.hp = this.maxHp = 100;
    this.speed = 9;
  }
}

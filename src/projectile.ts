import * as THREE from 'three';

const GEO = new THREE.SphereGeometry(0.22, 6, 4);
const MAT = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x2ec4b6, emissiveIntensity: 1.5, flatShading: true });

export class Projectile {
  active = false;
  mesh: THREE.Mesh;
  vx = 0; vz = 0;
  life = 0;
  damage = 1;
  pierce = 0;
  hitIds = new Set<number>();

  constructor(scene: THREE.Scene) {
    this.mesh = new THREE.Mesh(GEO, MAT);
    this.mesh.visible = false;
    scene.add(this.mesh);
  }

  fire(x: number, z: number, dx: number, dz: number, damage: number, pierce: number) {
    this.active = true;
    this.mesh.visible = true;
    this.mesh.position.set(x, 1, z);
    const speed = 26;
    this.vx = dx * speed; this.vz = dz * speed;
    this.life = 1.4;
    this.damage = damage;
    this.pierce = pierce;
    this.hitIds.clear();
  }

  kill() {
    this.active = false;
    this.mesh.visible = false;
  }

  update(dt: number) {
    this.mesh.position.x += this.vx * dt;
    this.mesh.position.z += this.vz * dt;
    this.life -= dt;
    if (this.life <= 0) this.kill();
  }

  get pos() { return this.mesh.position; }
}

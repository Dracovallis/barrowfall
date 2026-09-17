import * as THREE from 'three';

const GEO = new THREE.OctahedronGeometry(0.35);
const MAT = new THREE.MeshStandardMaterial({ color: 0xf2c94c, emissive: 0xf2c94c, emissiveIntensity: 0.6, flatShading: true });

export class Gem {
  active = false;
  mesh: THREE.Mesh;
  xp = 1;
  t = 0;

  constructor(scene: THREE.Scene) {
    this.mesh = new THREE.Mesh(GEO, MAT);
    this.mesh.visible = false;
    scene.add(this.mesh);
  }

  drop(x: number, z: number, xp: number) {
    this.active = true;
    this.mesh.visible = true;
    this.mesh.position.set(x, 0.6, z);
    this.mesh.scale.setScalar(xp > 1 ? 1.6 : 1);
    this.xp = xp;
    this.t = Math.random() * 6;
  }

  kill() {
    this.active = false;
    this.mesh.visible = false;
  }

  /** Bob, spin and drift toward hero within magnet radius. Returns true when picked up. */
  update(dt: number, heroPos: THREE.Vector3, magnet: number): boolean {
    this.t += dt;
    const p = this.mesh.position;
    p.y = 0.6 + Math.sin(this.t * 4) * 0.15;
    this.mesh.rotation.y += dt * 2.5;
    const dx = heroPos.x - p.x, dz = heroPos.z - p.z;
    const d = Math.hypot(dx, dz);
    if (d < magnet) {
      const pull = 14 * dt;
      p.x += (dx / d) * pull;
      p.z += (dz / d) * pull;
    }
    return d < 0.9;
  }

  get pos() { return this.mesh.position; }
}

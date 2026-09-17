import * as THREE from 'three';
import { ARENA_RADIUS } from './hero';
import { Game } from './game';

const BG = 0x0b0e1a;

const canvas = document.getElementById('c') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(BG);
scene.fog = new THREE.Fog(BG, 30, 60);

const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 200);
const CAM_OFFSET = new THREE.Vector3(0, 22, 13);

// Arena floor
const floor = new THREE.Mesh(
  new THREE.CylinderGeometry(ARENA_RADIUS, ARENA_RADIUS, 1, 48),
  new THREE.MeshStandardMaterial({ color: 0x3a3f4b, flatShading: true }),
);
floor.position.y = -0.5;
floor.receiveShadow = true;
scene.add(floor);

// Lights
scene.add(new THREE.HemisphereLight(0x8fa3c7, 0x1a1a22, 0.7));
const sun = new THREE.DirectionalLight(0xffffff, 1.6);
sun.position.set(20, 40, 10);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
const s = ARENA_RADIUS + 4;
sun.shadow.camera.left = -s; sun.shadow.camera.right = s;
sun.shadow.camera.top = s; sun.shadow.camera.bottom = -s;
sun.shadow.camera.near = 1; sun.shadow.camera.far = 100;
scene.add(sun);

const game = new Game(scene);
(window as any).game = game; // debug handle
game.start();

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// Fixed-timestep loop
const STEP = 1 / 60;
let acc = 0;
let last = performance.now();
const camTarget = new THREE.Vector3();
const lookAt = new THREE.Vector3();

function frame(now: number) {
  requestAnimationFrame(frame);
  acc += Math.min((now - last) / 1000, 0.25);
  last = now;
  while (acc >= STEP) {
    game.update(STEP);
    acc -= STEP;
  }
  const heroPos = game.hero.mesh.position;
  camTarget.copy(heroPos).add(CAM_OFFSET);
  camera.position.lerp(camTarget, 0.08);
  lookAt.copy(heroPos);
  if (game.shake > 0) {
    const k = game.shake * 1.6;
    lookAt.x += (Math.random() - 0.5) * k;
    lookAt.z += (Math.random() - 0.5) * k;
  }
  camera.lookAt(lookAt);
  renderer.render(scene, camera);
}
camera.position.copy(game.hero.mesh.position).add(CAM_OFFSET);
requestAnimationFrame(frame);

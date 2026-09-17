import * as THREE from 'three';
import { Hero, ARENA_RADIUS } from './hero';

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
const hemi = new THREE.HemisphereLight(0x8fa3c7, 0x1a1a22, 0.7);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 1.6);
sun.position.set(20, 40, 10);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
const s = ARENA_RADIUS + 4;
sun.shadow.camera.left = -s; sun.shadow.camera.right = s;
sun.shadow.camera.top = s; sun.shadow.camera.bottom = -s;
sun.shadow.camera.near = 1; sun.shadow.camera.far = 100;
scene.add(sun);

const hero = new Hero(scene);

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
    hero.update(STEP);
    acc -= STEP;
  }
  camTarget.copy(hero.mesh.position).add(CAM_OFFSET);
  camera.position.lerp(camTarget, 0.08);
  lookAt.copy(hero.mesh.position);
  camera.lookAt(lookAt);
  renderer.render(scene, camera);
}
camera.position.copy(hero.mesh.position).add(CAM_OFFSET);
requestAnimationFrame(frame);

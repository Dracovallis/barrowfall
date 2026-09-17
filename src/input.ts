const keys = new Set<string>();
let anyKeyHandlers: (() => void)[] = [];

window.addEventListener('keydown', (e) => {
  keys.add(e.code);
  for (const h of anyKeyHandlers) h();
});
window.addEventListener('keyup', (e) => keys.delete(e.code));
window.addEventListener('blur', () => keys.clear());

export function axis(): { x: number; z: number } {
  let x = 0, z = 0;
  if (keys.has('KeyA') || keys.has('ArrowLeft')) x -= 1;
  if (keys.has('KeyD') || keys.has('ArrowRight')) x += 1;
  if (keys.has('KeyW') || keys.has('ArrowUp')) z -= 1;
  if (keys.has('KeyS') || keys.has('ArrowDown')) z += 1;
  const len = Math.hypot(x, z);
  if (len > 0) { x /= len; z /= len; }
  return { x, z };
}

export function onAnyKey(h: () => void) {
  anyKeyHandlers.push(h);
}

export function clearAnyKey() {
  anyKeyHandlers = [];
}

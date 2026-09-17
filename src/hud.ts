const hud = document.getElementById('hud')!;
hud.innerHTML = `
  <div id="top">
    <div class="bar hp"><div class="fill"></div><span class="label"></span></div>
    <div class="bar xp"><div class="fill"></div><span class="label"></span></div>
    <div id="stats"><span id="timer">0:00</span><span id="kills">0 kills</span></div>
  </div>
  <button id="home" title="Back to title">⌂ Home</button>
  <div id="overlay" class="hidden"></div>
`;
export const homeBtn = hud.querySelector<HTMLButtonElement>('#home')!;

const hpFill = hud.querySelector<HTMLDivElement>('.hp .fill')!;
const hpLabel = hud.querySelector<HTMLSpanElement>('.hp .label')!;
const xpFill = hud.querySelector<HTMLDivElement>('.xp .fill')!;
const xpLabel = hud.querySelector<HTMLSpanElement>('.xp .label')!;
const timerEl = hud.querySelector<HTMLSpanElement>('#timer')!;
const killsEl = hud.querySelector<HTMLSpanElement>('#kills')!;
export const overlay = hud.querySelector<HTMLDivElement>('#overlay')!;

export function setHp(hp: number, max: number) {
  hpFill.style.width = `${Math.max(0, (hp / max) * 100)}%`;
  hpLabel.textContent = `${Math.ceil(Math.max(0, hp))} / ${max}`;
}
export function setXp(xp: number, need: number, level: number) {
  xpFill.style.width = `${Math.min(100, (xp / need) * 100)}%`;
  xpLabel.textContent = `Lv ${level}`;
}
export function setStats(time: number, kills: number) {
  const m = Math.floor(time / 60), s = Math.floor(time % 60);
  timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
  killsEl.textContent = `${kills} kills`;
}
export function showOverlay(html: string) {
  overlay.innerHTML = html;
  overlay.classList.remove('hidden');
}
export function hideOverlay() {
  overlay.classList.add('hidden');
  overlay.innerHTML = '';
}

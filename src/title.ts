// Title screen. Doubles as the application note for GAMELINE's
// "Game Developer – AI-Powered Web Games" opening (jobs.bg/job/8613171).

const REPO = 'https://github.com/Dracovallis/barrowfall';
const API = 'https://api.github.com/repos/Dracovallis/barrowfall/commits?per_page=100';

export function formatDuration(ms: number): string {
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins} minutes`;
  const h = Math.floor(mins / 60), m = mins % 60;
  return m ? `${h}h ${m}m` : `${h} hour${h === 1 ? '' : 's'}`;
}

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/** Fill the build-time stat: build-time git values first, then refresh from GitHub. */
export async function fillBuildTime(root: HTMLElement) {
  const el = root.querySelector<HTMLElement>('#build-time');
  const range = root.querySelector<HTMLElement>('#build-range');
  if (!el) return;
  const apply = (first: string, last: string) => {
    if (!first || !last) return;
    el.textContent = formatDuration(new Date(last).getTime() - new Date(first).getTime());
    if (range) range.textContent = `first commit ${fmtTime(first)} → latest ${fmtTime(last)}`;
  };
  apply(__FIRST_COMMIT__, __LAST_COMMIT__);
  try {
    const res = await fetch(API);
    if (!res.ok) return;
    const commits: { commit: { committer: { date: string } } }[] = await res.json();
    if (commits.length) apply(commits[commits.length - 1].commit.committer.date, commits[0].commit.committer.date);
  } catch { /* offline or rate-limited: keep build-time values */ }
}

export function titleHtml(): string {
  return `
  <div class="title">
    <div class="title-main">
      <h1>BARROWFALL</h1>
      <p class="tag">A 3D arena survivor. Survive the waves, level up, pick upgrades.</p>
      <p class="controls">WASD / arrows to move &middot; attacks are automatic &middot; click an upgrade when you level</p>
      <p class="press">Press any key to play</p>
    </div>
    <aside class="apply">
      <div class="apply-head">
        <span class="pill">Application</span>
        <span>Game Developer &ndash; AI-Powered Web Games &middot; GAMELINE</span>
      </div>

      <p class="q">&ldquo;How quickly could you build a simple playable game from a written concept?&rdquo;</p>
      <p class="a">This one: <strong id="build-time">&hellip;</strong> from a one-page brief to this build, with Claude Code as the primary dev tool.<br>
        <span class="muted" id="build-range"></span> &middot; <a href="${REPO}/commits/main" target="_blank" rel="noopener">commit log</a></p>

      <h3>Who</h3>
      <p>Krastyo Yordanov &mdash; 8+ years shipping web software, three finished games. Sofia, remote.</p>

      <h3>Games I've shipped</h3>
      <ul class="games">
        <li><a href="https://pikami.se" target="_blank" rel="noopener">Pikami.se</a><span>Multiplayer word game, daily challenge, head-to-head over WebSocket</span></li>
        <li><a href="https://antikonti.com" target="_blank" rel="noopener">Antikonti</a><span>Party card game, TV as host screen, phones as controllers</span></li>
        <li><a href="https://www.youtube.com/watch?v=oCLyZkeQ-Uc" target="_blank" rel="noopener">Skullstorm</a><span>Wave-based hero defense, Unity / C#, Android</span></li>
        <li><a href="${REPO}" target="_blank" rel="noopener">Barrowfall</a><span>This game. Three.js + TypeScript + Vite, no engine</span></li>
      </ul>

      <h3>Preferred tech</h3>
      <p>TypeScript, React, Three.js, Node, WebSocket, PHP</p>

      <h3>AI tools I use daily</h3>
      <p>Claude Code (primary), Cursor, GPT</p>

      <div class="links">
        <a class="btn" href="cv.pdf" target="_blank" rel="noopener">CV (PDF)</a>
        <a class="btn ghost" href="${REPO}" target="_blank" rel="noopener">Source</a>
        <a class="btn ghost" href="https://www.dracovallis.com" target="_blank" rel="noopener">dracovallis.com</a>
      </div>
    </aside>
  </div>`;
}

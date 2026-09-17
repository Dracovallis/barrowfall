// Title screen. Doubles as the application note for GAMELINE's
// "Game Developer – AI-Powered Web Games" opening (jobs.bg/job/8613171).

// First commit 14:10, last gameplay commit 14:19 on 2026-09-17 — see the commit log.
export const BUILD_TIME = 'under 15 minutes';
const REPO = 'https://github.com/Dracovallis/barrowfall';

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
      <p class="a">This one: <strong>${BUILD_TIME}</strong> from a one-page brief to this deployed build, using Claude Code as the primary dev tool. The <a href="${REPO}/commits/main" target="_blank" rel="noopener">commit log</a> is the timeline.</p>
      <dl>
        <dt>Who</dt>
        <dd>Krastyo Yordanov &mdash; 8+ years shipping web software, three finished games, Sofia (remote).</dd>
        <dt>Games</dt>
        <dd>
          <a href="https://pikami.se" target="_blank" rel="noopener">Pikami.se</a> multiplayer word game &middot;
          <a href="https://antikonti.com" target="_blank" rel="noopener">Antikonti</a> second-screen party game &middot;
          <a href="https://www.youtube.com/watch?v=oCLyZkeQ-Uc" target="_blank" rel="noopener">Skullstorm</a> Unity hero defense
        </dd>
        <dt>Stack</dt>
        <dd>TypeScript, React, Three.js, Node, WebSocket, PHP &middot; this game: Three.js + Vite, no engine</dd>
        <dt>AI tools</dt>
        <dd>Claude Code (daily driver), Cursor, GPT</dd>
      </dl>
      <div class="links">
        <a class="btn" href="cv.pdf" target="_blank" rel="noopener">CV (PDF)</a>
        <a class="btn ghost" href="${REPO}" target="_blank" rel="noopener">Source</a>
        <a class="btn ghost" href="https://www.dracovallis.com" target="_blank" rel="noopener">dracovallis.com</a>
      </div>
    </aside>
  </div>`;
}

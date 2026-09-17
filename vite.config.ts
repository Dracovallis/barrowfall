import { defineConfig } from 'vite';
import { execSync } from 'node:child_process';

// Build-time fallback for the "how long did this take" stat: first and last commit timestamps.
// At runtime the title screen refreshes these from the GitHub API.
function git(cmd: string): string {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return ''; }
}
const firstCommit = git('git log --reverse --format=%cI | head -1');
const lastCommit = git('git log -1 --format=%cI');

export default defineConfig({
  base: './',
  define: {
    __FIRST_COMMIT__: JSON.stringify(firstCommit),
    __LAST_COMMIT__: JSON.stringify(lastCommit),
  },
});

import { config, releaseIssues } from '../src/lib/config.js';
const issues = releaseIssues(config);
if (issues.length) { console.error(`Release blocked; configure: ${issues.join(', ')}`); process.exit(1); }
console.log('Release configuration is complete.');

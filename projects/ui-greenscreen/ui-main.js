import {DURATION,clamp,render} from './ui-core.js';
import {command,notifications,analytics,media,chat} from './scenes-a.js';
import {scanner,climate,checkout,timeline,navigation} from './scenes-b.js';
const builders={'scene-01-command-palette':command,'scene-02-notifications':notifications,'scene-03-analytics':analytics,'scene-04-media-player':media,'scene-05-team-chat':chat,'scene-06-security-scan':scanner,'scene-07-climate-control':climate,'scene-08-checkout':checkout,'scene-09-motion-timeline':timeline,'scene-10-navigation':navigation};
const id=new URLSearchParams(location.search).get('scene')||'scene-01-command-palette';
const update=(builders[id]||command)();
function at(t){update(clamp(Number(t)||0,0,DURATION));render()}
window.OPENER={DURATION,ready:true,seek:at,play(){const s=performance.now();const tick=n=>{at(((n-s)/1000)%DURATION);requestAnimationFrame(tick)};requestAnimationFrame(tick)}};
if(new URLSearchParams(location.search).has('clean'))at(0);else window.OPENER.play();

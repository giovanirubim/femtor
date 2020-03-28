import * as view3d from './view3d.js';
import * as leftbar from './leftbar.js';
import * as shell from './shell.js';
import * as views from './views.js';
import './view3d-controls.js';

let esx = null;
let esy = null;
const handleResize = () => {
	let sx = Math.max(0, window.innerWidth - leftbar.getWidth());
	let sy = window.innerHeight;
	if (sx === esx && sy === esy) {
		esx = sx;
		esy = sy;
	}
	view3d.resize(sx, sy);
	view3d.render();
	return true;
};

$(document).ready(() => {
	leftbar.init();
	shell.loadLocal();
	const canvas = $(view3d.getCanvas());
	$('#view3d').append(canvas);
	handleResize();
	$(window).bind('resize', handleResize);
});
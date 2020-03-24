import * as view3d from './view3d.js';
import * as leftbar from './leftbar.js';
import * as shell from './shell.js';
import './views.js';
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
	const canvas = $(view3d.getCanvas());
	$('#view3d').append(canvas);
	handleResize();
	$(window).bind('resize', handleResize);
});

let thin = shell.addAxis({
	inner_diameter: 1,
	outer_diameter: 5
});
let medium = shell.addAxis({
	inner_diameter: 1,
	outer_diameter: 15
});
let large = shell.addAxis({
	inner_diameter: 1,
	outer_diameter: 30
});
shell.addAxisInstance({ axis_id: medium.id, length: 5 });
shell.addAxisInstance({ axis_id: large.id, length: 5 });
shell.addAxisInstance({ axis_id: thin.id, length: 50 });
window.shell = shell;
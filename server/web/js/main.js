import * as view3d from './view3d.js';
import * as leftbar from './leftbar.js';
import * as shell from './shell.js';
import * as views from './views.js';
import './view3d-controls.js';

const downloadTextFile = (fileName, content) => {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
	element.setAttribute('download', fileName);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
};

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

const bindExportJSON = () => {
	$('#exportJson').bind('click', () => {
		const json = shell.generateJson();
		downloadTextFile('Project.json', json);
	});
};

const bindLoadFile = () => {
	const input = $('#loadFile');
	input.bind('change', () => {
		const {files} = input[0];
		const [file] = files;
		if (!file) {
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			const {name} = file;
			const {result} = reader;
			const ext = name.substr(name.lastIndexOf('.') + 1).toLowerCase();
			if (ext === 'ri') {
				shell.loadRI(result);
			} else {
				shell.loadJSON(result);
			}
			shell.storeLocal();
		};
		reader.readAsText(file);
	});
	input.closest('.option').bind('click', e => {
		const target = e.target || e.srcElement;
		if (target !== input[0]) {
			input.trigger('click');
		}
	});
};

const bindLeftbarButtons = () => {
	$('#add_axis').bind('click', () => {
		views.openNewAxisForm();
	});
};

$(document).ready(() => {
	leftbar.init();
	shell.loadLocal();
	const canvas = $(view3d.getCanvas());
	$('#view3d').append(canvas);
	handleResize();
	$(window).bind('resize', handleResize);
	bindLoadFile();
	bindExportJSON();
	bindLeftbarButtons();
});

window.shell = shell;
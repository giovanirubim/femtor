// ========================<-------------------------------------------->======================== //
// Módulo inicializdor

// ========================<-------------------------------------------->======================== //
// Módulos acessados

import * as view3d from './view3d.js';
import * as leftbar from './leftbar.js';
import * as shell from './shell.js';
import * as views from './views.js';
import './view3d-controls.js';

// Editor size x
let esx = null;

// Editor size y
let esy = null;

// Trata o redimensionamento da tela
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
	
	// Inicializa o módulo da barra lateral
	leftbar.init();

	// Tenta carregar um projeto salvo localmente no navegador
	shell.loadLocal();

	// Insere na página o canvas contendo a visualização 3D
	const canvas = $(view3d.getCanvas());
	$('#view3d').append(canvas);

	handleResize();
	$(window).bind('resize', handleResize);

	// Inicializa um nome de projeto
	shell.projectName(shell.projectName());
});
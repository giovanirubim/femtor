// ========================<-------------------------------------------->======================== //
// Módulos acessados

import * as cmdkey from './cmdkey.js';
import * as view3d from './view3d.js';
import * as forms from './forms.js';
import animate from './animate.js';

// ========================<-------------------------------------------->======================== //

// Distância mínima que o cursor deve ser movido em pixels para que um evento de clicar e arrastar
// seja iniciado
const minDist = 5;

// Animações
const animation = {
	home: null,
	perspective: null
};

// Transforma uma função linear numa função 'suave' (variação senóide)
const smooth = x => (1 - Math.cos(Math.PI*x))*0.5;

// Animação home
const animateHome = () => {
	const o0 = view3d.getOrientation();
	const o1 = Math.round(o0/(Math.PI*0.5))*Math.PI*0.5;
	const r0 = view3d.getRotation();
	const r1 = Math.round(r0/Math.PI)*Math.PI;
	const s0 = view3d.getShift();
	const s1 = 0;
	const d0 = view3d.getDistance();
	const d1 = view3d.getInitialDistance();
	animation.home = animate(t => {
		const a = smooth(t);
		const b = 1 - a;
		view3d.setOrientation(o0*b + o1*a);
		view3d.setRotation(r0*b + r1*a);
		view3d.setShift(s0*b + s1*a);
		view3d.setDistance(d0*b + d1*a);
		view3d.render();
	});
};
const stopHomeAnimation = () => {
	const {home} = animation;
	if (!home || !home.running) return false;
	return home.stop();
};
const finishHomeAnimation = () => {
	const {home} = animation;
	if (!home || !home.running) return false;
	return home.finish();
};

// Animation de perspectiva
const animatePerspective = p1 => {
	const p0 = view3d.getPerspective();
	animation.perspective = animate(b => {
		const a = 1 - b;
		view3d.setPerspective(a*p0 + b*p1);
		view3d.render();
	});
};
const stopPerspectiveAnimation = () => {
	const {perspective} = animation;
	if (!perspective || !perspective.running) return false;
	return perspective.stop();
};
const finishPerspectiveAnimation = () => {
	const {perspective} = animation;
	if (!perspective || !perspective.running) return false;
	return perspective.finish();
};

// Atalhos de teclado do editor
cmdkey.bind({key: 'home'}, () => {
	if (finishHomeAnimation()) {
		finishPerspectiveAnimation();
		return;
	}
	animateHome();
	stopPerspectiveAnimation();
	animatePerspective(0);
});
cmdkey.bind({key: 'p'}, () => {
	if (finishPerspectiveAnimation()) {
		return;
	}
	animatePerspective(1 - view3d.getPerspective());
});

// Eventos de mouse
const bindMouseControls = () => {

	const canvas = $(view3d.getCanvas());
	let click = null;

	// Calcula a distância entre dois pontos a e b
	const calcDist = (ax, ay, bx, by) => {
		const dx = bx - ax;
		const dy = by - ay;
		return Math.sqrt(dx*dx + dy*dy);
	};

	canvas.bind('mousedown', e => {
		e.preventDefault();
		if (e.button !== 0) return;
		
		// Coordenada do clique no canvas
		const x = e.offsetX;
		const y = e.offsetY;

		// Informações do início do clique
		click = {
			x, y,
			moved: false,
			shift0: view3d.getShift(),
			rotation0: view3d.getRotation(),
			orientation0: view3d.getOrientation(),
			shift1: view3d.getShiftAt(x, y),
			rotation1: view3d.getRotationAt(x, y),
			orientation1: view3d.getOrientationAt(x, y),
			altKey: e.altKey,
			ctrlKey: e.ctrlKey,
			shiftKey: e.shiftKey,
		};
	});

	canvas.bind('mousemove', e => {

		if (click === null) {
			return;
		}

		// Ignora se o botão esquerdo não estiver pressionado
		if ((e.buttons & 1) === 0) {
			click = null;
			return;
		}

		// Coordenada do clique
		const x = e.offsetX;
		const y = e.offsetY;

		let startedNow = false;
		if (click.moved === false) {
			const x0 = click.x;
			const y0 = click.y;
			if (calcDist(x0, y0, x, y) < minDist) {
				return;
			}
			click.moved = true;
			startedNow = true;
		}
		if (startedNow) {
			stopHomeAnimation();
		}

		if (click.shiftKey) {

			// Deslocamento do modelo
			const {shift0, shift1} = click;
			const shift2 = view3d.getShiftAt(x, y);
			view3d.setShift(shift0 + shift2 - shift1);
			view3d.render();

		} else if (click.altKey) {
			
			// Rotação da orientação
			
			const {orientation0, orientation1} = click;
			const orientation2 = view3d.getOrientationAt(x, y);
			const ang = orientation0 + orientation2 - orientation1;
			const step = Math.PI/2;
			const a = ang;
			const b = Math.round(ang/step)*step;

			// O quão perto o ângulo está de um ângulo reto (0 a 1)
			const near = 1 - Math.abs(b - a)/step*2;

			// Intervalo livre entre os ângulos retos
			const cut = 0.8;

			if (near >= cut) {
				view3d.setOrientation(b);
			} else {
				const val = near/cut;
				view3d.setOrientation(b*val + a*(1 - val));
			}

			view3d.render();

		} else {

			// Rotaciona o modelo
			const {rotation0, rotation1} = click;
			const rotation2 = view3d.getRotationAt(x, y);
			view3d.setRotation(rotation0 + rotation2 - rotation1);
			view3d.render();
		}
	});

	// Aproxima/Afasta o modelo numa escala exponencial (quanto mais longe mais rapido se afasta)
	canvas[0].addEventListener('wheel', e => {
		if (forms.length()) return;
		const delta = e.deltaY/Math.abs(e.deltaY);
		const d0 = view3d.getDistance();
		const d1 = Math.exp(Math.log(d0) + delta*0.04);
		view3d.setDistance(d1);
		view3d.render();
	});

};

$(document).ready(bindMouseControls);

// End of File
// ========================<-------------------------------------------->======================== //
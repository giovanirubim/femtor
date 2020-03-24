import * as project from './project.js';
import * as view3d from './view3d.js';

// Trata alterações que modificam visualmente o projeto
// Aguarda um determinado tempo e renderiza o modelo 3d
let view3d_timeout = null;
const flush3d = () => {
	view3d_timeout = null;
	view3d.render();
};
const handleViewChange = () => {
	if (view3d_timeout !== null) return;
	view3d_timeout = setTimeout(flush3d, 50);
};

// ========================<-------------------------------------------->======================== //
// Métodos públicos de manipulação do projeto

export const addAxis = data => {
	const obj = project.add('axis', data);
	return obj;
};

export const addAxisInstance = data => {
	const axis = project.find(data.axis_id).obj;
	if (!axis) {
		throw 'Axis not found';
	}
	const obj = project.add('axis_instance', data);
	const {inner_diameter, outer_diameter} = axis;
	view3d.addCylinder(obj.id, inner_diameter/2, outer_diameter/2, obj.length);
	handleViewChange();
	return obj;
};

export const removeAxisInstance = arg => {
	const id = arg instanceof Object? arg.id: arg;
	const {obj} = project.find(id);
	if (!obj) {
		throw 'Invalid argument';
	}
	project.remove(obj);
	view3d.removeCylinder(obj.id);
	handleViewChange();
};
import * as project from './project.js';
import * as view3d from './view3d.js';
import * as ri from './ri-format.js';

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

// Insere um eixo a partir dos dados contidos no objeto data
export const addAxis = data => {
	const obj = project.add('axis', data);
	return obj;
};

// Insere uma instância de eixo a partir dos dados contidos no objeto data
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

// Remove uma instância de eixo
// O argumento pode ser o id, o próprio objeto, ou um objeto de mesmo id
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

// Altera uma instância de eixo
export const updateAxisInstance = data => {
	const {id, length} = data;
	const instance = project.find(id).obj;
	if (length !== undefined) {
		instance.length = length;
		view3d.updateCylinder(id, null, null, length);
	}
	handleViewChange();
};

// Limpa o projeto
export const clear = () => {
	project.clear();
	view3d.clearCylinders();
	handleViewChange();
};

// Mapea o tipo com a função de add
const addMap = {
	'axis': addAxis,
	'axis_instance': addAxisInstance
};

// Armazena localmente o projeto
export const storeLocal = () => {
	if (!localStorage) {
		return false;
	}
	const {database} = project;
	const json = JSON.stringify(database);
	localStorage.setItem('json', json);
	return true;
};

// Carrega localmente o projeto
export const loadLocal = () => {
	if (!localStorage) {
		return false;
	}
	const json = localStorage.getItem('json');
	if (!json) {
		return false;
	}
	loadJSON(json);
	return true;
};

// Carrega uma string com o conteúdo de um arquivo RI
export const loadRI = src => {
	ri.load(src);
};

// Carrega uma string com um JSON contendo o projeto
export const loadJSON = json => {
	clear();
	const database = JSON.parse(json);
	project.dependencyOrder.forEach(type => {
		const add = addMap[type];
		database[type].forEach(add);
	});
	handleViewChange();
	return true;
};

export const generateJson = () => JSON.stringify(project.database);
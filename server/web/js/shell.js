// ========================<-------------------------------------------->======================== //
// Núcleo do editor (shell)
// Todas as alterações realizadas no projeto devem ser executadas por este módulo
// Este módulo fará as alterações necessárias na base de dados no módulo project e as alterações
// necessárias na visualização do editor e na barra lateral através dos módulos view3d e leftbar

// ========================<-------------------------------------------->======================== //
// Módulos acessados

import * as project from './project.js';
import * as leftbar from './leftbar.js';
import * as view3d from './view3d.js';
import * as ri from './ri-format.js';

// ========================<-------------------------------------------->======================== //

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

export const getType = arg => {
	const id = arg instanceof Object? arg.id: arg;
	return project.find(id).type;
};

// Insere um eixo a partir dos dados contidos no objeto data
export const addAxis = data => {
	const obj = project.add('axis', data);
	leftbar.add('axis', obj);
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
	leftbar.add('axis_instance', obj);
	handleViewChange();
	return obj;
};

// Remove um eixo
// O argumento pode ser o id, o próprio objeto, ou um objeto de mesmo id
export const removeAxis = arg => {
	const id = arg instanceof Object? arg.id: arg;
	const {obj, type} = project.find(id);
	if (!obj) {
		throw 'Invalid argument';
	}
	if (type !== 'axis') {
		throw 'The object found is not an axis';
	}
	project.remove(id);
	leftbar.remove(id);
	const instances = project.listByAttr('axis_instance', 'axis_id', id);
	instances.forEach(removeAxisInstance);
};

// Remove uma instância de eixo
// O argumento pode ser o id, o próprio objeto, ou um objeto de mesmo id
export const removeAxisInstance = arg => {
	const id = arg instanceof Object? arg.id: arg;
	const {obj} = project.find(id);
	if (!obj) {
		throw 'Invalid argument';
	}
	leftbar.remove(id);
	project.remove(obj);
	view3d.removeCylinder(id);
	handleViewChange();
};

// Altera uma instância de eixo
export const updateAxisInstance = data => {
	const {id, length} = data;
	const instance = project.find(id).obj;
	if (length == null || length == instance.length) {
		return false;
	}
	instance.length = length;
	view3d.updateCylinder(id, null, null, length);
	handleViewChange();
	return true;
};

// Atualiza um eixo
export const updateAxis = data => {
	const {id} = data;
	const axis = project.find(id).obj;
	const changed = {};
	let updated = false;
	for (let attr in axis) {
		const newVal = data[attr];
		if (newVal !== undefined && newVal !== axis[attr]) {
			axis[attr] = newVal;
			changed[attr] = true;
			updated = true;
		}
	}
	if (updated === false) {
		return false;
	}
	const r0 = axis.inner_diameter/2;
	const r1 = axis.outer_diameter/2;
	if (changed['inner_diameter'] || changed['outer_diameter']) {
		const instances = project.listByAttr('axis_instance', 'axis_id', id);
		instances.forEach(instance => {
			const {id} = instance;
			view3d.updateCylinder(id, r0, r1, null);
		});
		handleViewChange();
	}
	if (changed['name']) {
		leftbar.updateTitle(axis.id, axis.name);
		// TODO: Alterar rótulos das instâncias também
	}
	return true;
};

// Limpa o projeto
export const clear = () => {
	leftbar.clear();
	project.clear();
	view3d.clearCylinders();
	handleViewChange();
};

// Mapea o tipo com a função de add
const addMap = {
	'axis': addAxis,
	'axis_instance': addAxisInstance
};

// Mapea o tipo com a função de remover
const removeMap = {
	'axis': removeAxis,
	'axis_instance': removeAxisInstance
};

// Remove um elemento do projeto
export const remove = arg => {
	const id = arg instanceof Object? arg.id: arg;
	const {type} = project.find(id);
	if (!type) {
		throw 'Invalid argument';
	}
	removeMap[type](id);
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
export const loadRI = (src, config) => {
	ri.load(src, config);
};

// Carrega uma string com um JSON contendo o projeto
export const loadJSON = json => {
	clear();
	const database = JSON.parse(json);
	projectName(database.name);
	project.dependencyOrder.forEach(type => {
		const add = addMap[type];
		database[type].forEach(add);
	});
	handleViewChange();
	return true;
};

// Retorna uma string contendo um JSON com os dados do projeto
export const generateJson = () => JSON.stringify(project.database);

// Retorna ou Atribui o nome do projeto
export const projectName = arg => {
	if (arg === undefined) {
		return project.database.name;
	}
	if (arg != null) {
		$('head title').html($.txt('ROTMef - ' + arg));
		project.database.name = arg;
	}
};

// End of File
// ========================<-------------------------------------------->======================== //
// Estrutura da base de dados do modelo
export const database = {
	axis: [],
	disk: [],
	mg: [],
	me: [],
	axis_instance: [],
	node: [],
	disk_instance: [],
	mg_instance: [],
	me_instance: [],
	last_id: 0
};

// Mapa de id => objeto
let idMap = {};

// Mapa de id => tipo do objeto
let typeMap = {};

// Adiciona um objeto à base de dados
const insert = (obj, type) => {
	const array = database[type];
	let {id} = obj;
	if (idMap[id]) throw 'Database id colision';
	if (!id) id = obj.id = ++database.last_id;
	obj.id = id;
	idMap[id] = obj;
	typeMap[id] = type;
	array.push(obj);
	return obj;
};

// ========================<-------------------------------------------->======================== //
// Classes dos elementos do projeto

class Axis {
	constructor() {
		this.id = null;
		this.name = 'Unnamed axis';
		this.description = '';
		this.outer_diameter = 0;
		this.inner_diameter = 0;
		this.density = 0;
		this.mod_e = 0;
		this.mod_g = 0;
	}
}

class AxisInstance {
	constructor() {
		this.id = null;
		this.axis_id = null;
		this.length = 0;
	}
}

// ========================<-------------------------------------------->======================== //
// Métodos públicos para a manipulação do projeto

const typeToClass = {
	'axis': Axis,
	'axis_instance': AxisInstance,
};

export const dependencyOrder = [
	'axis',
	'axis_instance'
];

// Busca um objeto na base de dados
// Se includeIndex for verdadeiro inclui no objeto resultante da busca o índice do objeto no vetor
// correspondente
export const find = (id, includeIndex) => {
	const type = typeMap[id] || null;
	const array = database[type] || [];
	const obj = idMap[id] || null;
	let index = null;
	if (includeIndex) index = array.indexOf(obj);
	return {obj, type, index};
};

// Remove um elemento da base de dados
export const remove = arg => {
	const obj = arg instanceof Object? arg: idMap[arg];
	if (!obj) throw 'Invalid argument';
	const {id} = obj;
	const type = typeMap[id];
	const array = database[type];
	const index = array.indexOf(obj);
	array.splice(index, 1);
	delete idMap[id];
	delete typeMap[id];
};

export const add = (type, data) => {
	const constructor = typeToClass[type];
	if (!constructor) throw 'Invalid type';
	const obj = new constructor();
	for (let attr in obj) {
		const value = data[attr];
		if (value !== undefined) {
			obj[attr] = value;
		}
	}
	insert(obj, type);
	return obj;
};

export const clear = () => {
	dependencyOrder.forEach(type => database[type].length = 0);
	database.last_id = 0;
	idMap = {};
	typeMap = {};
};
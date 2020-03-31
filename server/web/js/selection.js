// ========================<-------------------------------------------->======================== //
// Módulo que gerencia elementos selecionados no modelo

const idMap = {};
const onAddHandlers = {};
const onRemoveHandlers = {};

export const all = [];
export const types = {
	axis: [],
	disk: [],
	mg: [],
	me: [],
	axis_instance: [],
	disk_instance: [],
	mg_instance: [],
	me_instance: [],
	node: [],
};

// ========================<-------------------------------------------->======================== //

const arrayRemove = (array, obj) => array.splice(array.indexOf(obj), 1);

// ========================<-------------------------------------------->======================== //

export const add = (obj, type) => {
	const {id} = obj;
	if (idMap[id] !== undefined) {
		return false;
	}
	all.push(obj);
	types[type].push(obj);
	idMap[id] = true;
	const handler = onAddHandlers[type];
	if (handler !== undefined) {
		handler(obj);
	}
	return true;
};

export const remove = (obj, type) => {
	const {id} = obj;
	if (idMap[id] === undefined) {
		return false;
	}
	arrayRemove(all, obj);
	arrayRemove(types[type], obj);
	delete idMap[id];
	const handler = onRemoveHandlers[type];
	if (handler !== undefined) {
		handler(obj);
	}
	return true;
};

export const has = arg => (arg instanceof Object? arg.id: arg) in idMap;
export const hasType = type => types[type].length !== 0;
export const numberOf = type => types[type].length;
export const length = () => all.length;
export const first = () => all[0];
export const toggle = (obj, type) => has(obj)? remove(obj, type): add(obj, type);

export const clear = type => {
	if (!type) {
		for (let type in types) {
			clear(type);
		}
		return;
	}
	const array = types[type];
	for (let i=array.length; i--;) {
		remove(array[i], type);
	}
};

export const each = (a, b) => {
	if (b === undefined) {
		all.forEach(a);
	} else {
		types[a].forEach(b);
	}
};

export const onselect = (type, handler) => {
	onAddHandlers[type] = handler;
};

export const onunselect = (type, handler) => {
	onRemoveHandlers[type] = handler;
};

// ========================<-------------------------------------------->======================== //
// ========================<-------------------------------------------->======================== //
// Global variables

let leftbar;
let leftbarContent;
let lastAutoId = 0;
const idMap = {};

// ========================<-------------------------------------------->======================== //
// Item

class Item {
	constructor(id) {
		if (!id) id = 'auto_' + (++lastAutoId);
		idMap[id] = this;
		const main = $.new(`div#${id}.item`);
		const head = $.new('div.head');
		const buttons = $.new('div.buttons');
		main.append(head);
		const title = $.new('div.title');
		head.append([buttons, title]);
		this.id = id;
		this.jdom = { main, title, buttons };
		this.buttonMap = {};
	}
	setTitle(text) {
		this.jdom.title.html($.txt(text));
		return this;
	}
	addButton(imgSrc, name) {
		const {buttonMap, jdom} = this;
		const button = $.new(`img.button[name="${name}"]`);
		button.attr('src', imgSrc);
		buttonMap[name] = button;
		jdom.buttons.append(button);
		return this;
	}
	remove() {
		this.jdom.main.remove();
		delete idMap[this.id];
		return this;
	}
}

// ========================<-------------------------------------------->======================== //
// Private methods

const append = item => leftbarContent.append(item.jdom.main);

// ========================<-------------------------------------------->======================== //
// Public methods

export const getWidth = () => {
	return parseInt(leftbar.css('width').replace('px',''));
};

export const get = id => idMap[id] || null;

export const createItem = id => new Item(id);

export const init = () => {
	leftbar = $('#leftbar');
	leftbarContent = leftbar.children('.content');
	const axis = new Item('axis').setTitle('Eixos')/*.addButton('img/add.png', 'add')*/;
	const disk = new Item('disk').setTitle('Discos')/*.addButton('img/add.png', 'add')*/;
	const mg = new Item('mg').setTitle('Mancais guia')/*.addButton('img/add.png', 'add')*/;
	const me = new Item('me').setTitle('Mancais escora')/*.addButton('img/add.png', 'add')*/;
	append(axis);
	append(disk);
	append(mg);
	append(me);
};

// End of File
// ========================<-------------------------------------------->======================== //
import animate from './animate.js';
let popups = [];

class Popup {
	constructor(config) {
		let content;
		let onresize;
		if (config) {
			content = config.content;
			onresize = config.onresize;
		}
		const shadow = $.new('div.popup-shadow');
		const wrapper = $.new('div.popup-content-wrapper');
		const container = $.new('div.popup-container');
		shadow.append(wrapper);
		wrapper.append(container);
		$('body').append(shadow);
		this.shadow = shadow;
		this.container = container;
		this.wrapper = wrapper;
		setTimeout(() => {
			this.handleResize();
			shadow.animate({opacity: 1});
		}, 0);
		popups.push(this);
	}
	handleResize() {
		const {onresize, shadow, wrapper} = this;
		if (onresize) onresize(this);
		const mx = Math.max(0, Math.floor((window.innerWidth - wrapper.sx())*0.5));
		const my = Math.max(0, Math.floor((window.innerHeight - wrapper.sy())*0.4));
		wrapper.css({
			'margin-top': my + 'px',
			'margin-left': mx + 'px',
		});
		return this;
	}
	close() {
		const index = popups.indexOf(this);
		if (index === -1) return this;
		popups.splice(index, 1);
		const {shadow} = this;
		shadow.animate({opacity: 0}, ()=>{
			shadow.remove();
		});
		return this;
	}
	find(selector) {
		return this.shadow.find(selector);
	}
	add(element) {
		this.container.append(element);
		return this;
	}
}

class Form {
	constructor() {
		const popup = new Popup();
		setTimeout(() => {
			popup.find('input').first().focus();
		}, 0);
		this.popup = popup;
		this.currentRow = null;
	}
	title(value) {
		this.popup.add($.new('div.form-title').append($.txt(value)));
		return this;
	}
	addInput({title, type, name, initial, col = 1}) {
		let {currentRow} = this;
		if (currentRow === null || !currentRow.hasClass('field-row')) {
			this.popup.add(currentRow = $.new('div.field-row'));
			this.currentRow = currentRow;
		}
		const field = $.new('div.form-field.col-' + col);
		const dTitle = $.new('div.form-field-title').append($.txt(title));
		const dContent = $.new('div.form-field-content');
		field.append([dTitle, dContent]);
		if (type === 'text') {
			field.addClass('form-field-text');
			dContent.append($.new(`input[type="text"][name="${ name }"][spellcheck="false"]`));
		}
		currentRow.append(field);
		return this;
	}
	addButton({label, color, col = 1, bg, click}) {
		let {currentRow} = this;
		if (currentRow === null || !currentRow.hasClass('button-row')) {
			this.popup.add(currentRow = $.new('div.button-row'));
			this.currentRow = currentRow;
		}
		const button = $.new(`input[type="button"][value="${ label }"].col-${ col }`);
		if (click) button.bind('click', () => click(button, this));
		if (bg) button.addClass('bg-' + bg);
		currentRow.prepend(button);
		return this;
	}
	data() {
		const data = {};
		this.find('input').each(function(){
			const element = $(this);
			const name = element.attr('name');
			const value = element.val();
			data[name] = value;
		});
		return data;
	}
	endl() {
		this.currentRow = null;
		return this;
	}
	find() {
		return this.popup.find(...arguments);
	}
	close() {
		this.popup.close();
		return this;
	}
};

export const create = arg => new Form(arg);
export const length = () => popups.length;

window.addEventListener('resize', () => {
	popups.forEach(popup => popup.handleResize());
});
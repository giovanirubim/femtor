import * as shell from './shell.js';
import * as view3d from './view3d.js';
import * as views from './views.js';

// ========================<-------------------------------------------->======================== //
// Global variables

let leftbar;

// ========================<-------------------------------------------->======================== //
// Public methods

export const getWidth = () => {
	return parseInt((leftbar.css('width')).replace('px',''));
};

const downloadTextFile = (fileName, content) => {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
	element.setAttribute('download', fileName);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
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

const bindButtons = () => {
	leftbar.on('click', '.remove-axis', function(){
		const element = $(this).closest('.item');
		const id = element.attr('id').substr(3); // Ignora o prefixo 'pid'
		remove(id);
		shell.removeAxis(id);
	});
	$('#add_axis').bind('click', () => {
		views.openNewAxisForm();
	});
};

const bindContainers = () => {
	$('#leftbar .open-close .button').bind('click', function(){
		const container = $(this).closest('.container');
		container.toggleClass('closed');
	});
};

export const init = () => {
	leftbar = $('#leftbar');
	bindContainers();
	bindExportJSON();
	bindLoadFile();
	bindButtons();
};

export const add = (type, object) => {
	if (type === 'axis') {
		const template = $('.axis-item.template');
		const parent = template.parent();
		const item = template.clone();
		item.removeClass('template');
		parent.append(item);
		item.find('.title').html($.txt(object.name));
		item.attr('id', 'pid' + object.id);
	}
};

export const remove = arg => {
	const id = arg instanceof Object? arg.id: arg;
	const item = $('#pid'+id);
	item.remove();
};

export const clear = () => {
	$('.item').not('.template').remove();
};

// End of File
// ========================<-------------------------------------------->======================== //
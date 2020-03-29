import * as project from './project.js';
import * as shell from './shell.js';
import * as view3d from './view3d.js';
import * as views from './views.js';
import * as scinot from './scinot.js';

// ========================<-------------------------------------------->======================== //
// Global variables

let leftbar;

// ========================<-------------------------------------------->======================== //
// Public methods

// Calcula a largura da barra lateral
export const getWidth = () => {
	return parseInt((leftbar.css('width')).replace('px',''));
};

// Gera o download de um arquivo de conteúdo textual
const downloadTextFile = (fileName, content) => {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
	element.setAttribute('download', fileName);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
};

// Exporta o projeto utilizando o formato JSON
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
		views.newAxis();
	});
	leftbar.on('click', '.edit-axis', function(){
		const item = $(this).closest('.item');
		const id = item.attr('id').substr(3);
		const {obj} = project.find(id);
		views.editAxis(obj);
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

export const add = (type, obj) => {
	if (type === 'axis') {
		const template = $('.axis-item.template');
		const parent = template.parent();
		const item = template.clone();
		item.removeClass('template');
		parent.append(item);
		item.find('.title').html($.txt(obj.name));
		item.attr('id', 'pid' + obj.id);
	}
	if (type === 'axis_instance') {
		const template = $('.axis-instance-item.template');
		const parent = template.parent();
		const item = template.clone();
		item.removeClass('template');
		parent.append(item);
		const {index} = project.find(obj.id, true);
		const axis = project.find(obj.axis_id).obj;
		item.find('.axis-name').html($.txt(axis.name));
		item.find('.length').html($.txt(scinot.dump(obj.length)));
		item.find('.index').html($.txt(index + 1));
	}
};

export const remove = arg => {
	const id = arg instanceof Object? arg.id: arg;
	const item = $('#pid'+id);
	item.remove();
};

export const updateTitle = (id, title) => {
	$('#pid'+id).find('.title').html($.txt(title));
};

export const clear = () => {
	$('.item').not('.template').remove();
};

// End of File
// ========================<-------------------------------------------->======================== //
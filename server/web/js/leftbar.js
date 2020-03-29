// ========================<-------------------------------------------->======================== //
// Responsável pelos eventos e elementos da barra lateral

// ========================<-------------------------------------------->======================== //
// Módulos acessados

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

// Gera uma string correspondente a um id para ser utilizada como id no elemento dom correspondente
const getIdAttr = id => 'pid' + id;

// Extrai o id numérico da string utilizada como id de um elemento dom
const getIdFrom = attr => parseInt(attr.substr(3));

const bindExportJSON = () => {
	// Exporta o projeto utilizando o formato JSON
	$('#exportJson').bind('click', () => {
		const json = shell.generateJson();
		downloadTextFile(shell.projectName() + '.json', json);
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
			const index = name.lastIndexOf('.');
			const ext = name.substr(index + 1).toLowerCase();
			if (ext === 'ri') {
				shell.loadRI(result);
				shell.projectName(name.substr(0, index));
			} else if (ext === 'json') {
				shell.loadJSON(result);
			} else {
				throw 'Invalid file extension';
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

	// Evento de remoção de eixos
	leftbar.on('click', '.remove-axis', function(){
		const element = $(this).closest('.item');
		const id = getIdFrom(element.attr('id'));
		remove(id);
		shell.removeAxis(id);
	});
	
	// Evento de adição de eixos
	$('#add_axis').bind('click', () => {
		views.newAxis();
	});

	// Evento de edição de eixos
	leftbar.on('click', '.edit-axis', function(){
		const item = $(this).closest('.item');
		const id = getIdFrom(item.attr('id'));
		const {obj} = project.find(id);
		views.editAxis(obj);
	});

};

// Adiciona os eventos de abrir e fechar um container da barra lateral
const bindContainers = () => {
	$('#leftbar .open-close .button').bind('click', function(){
		const container = $(this).closest('.container');
		container.toggleClass('closed');
	});
};

// Função que deve ser chamada apenas uma vez quando a página já está carregada
export const init = () => {
	leftbar = $('#leftbar');
	bindContainers();
	bindExportJSON();
	bindLoadFile();
	bindButtons();
};

// Insere um objeto 'obj' do tipo 'type' na barra lateral
export const add = (type, obj) => {
	if (type === 'axis') {
		const template = $('.axis-item.template');
		const parent = template.parent();
		const item = template.clone();
		item.removeClass('template');
		parent.append(item);
		item.find('.title').html($.txt(obj.name));
		item.attr('id', getIdAttr(obj.id));
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

// Remove um item da barra lateral
// O argumento pode ser o objeto correspondente ou seu id
export const remove = arg => {
	const id = arg instanceof Object? arg.id: arg;
	const item = $('#'+getIdAttr(id));
	item.remove();
};

// Atualiza o título textual de um item na barra lateral a partir do id do objeto correspondente
export const updateTitle = (id, title) => {
	$('#'+getIdAttr(id)).find('.title').html($.txt(title));
};

// Remove todos os itens da barra lateral
export const clear = () => {
	$('.item').not('.template').remove();
};

// End of File
// ========================<-------------------------------------------->======================== //
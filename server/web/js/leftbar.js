import * as shell from './shell.js';
import * as view3d from './view3d.js';

// ========================<-------------------------------------------->======================== //
// Global variables

let leftbar;

// ========================<-------------------------------------------->======================== //
// Public methods

export const getWidth = () => {
	return parseInt((leftbar.css('width')).replace('px',''));
};

export const init = () => {
	leftbar = $('#leftbar');
	$('#leftbar .open-close .button').bind('click', function(){
		const container = $(this).closest('.container');
		container.toggleClass('closed');
	});
	leftbar.on('click', '.remove-axis', function(){
		const element = $(this).closest('.item');
		const id = element.attr('id').substr(3); // Ignora o prefixo 'pid'
		remove(id);
		shell.removeAxis(id);
	});
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
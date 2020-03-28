import * as forms from './forms.js';
import * as shell from './shell.js';

export const axisForm = (title, onsubmit) => {
	const form = forms.create().title(title);
	form.addInput({title: 'Nome do eixo', type: 'text', name: 'name', col: 2});
	form.addInput({title: 'Descrição', type: 'text', name: 'desc', col: 4});
	form.endl();
	form.addInput({title: 'Diâmetro interno (m)', type: 'text', name: 'inner_diameter', col: 2});
	form.addInput({title: 'Diâmetro externo (m)', type: 'text', name: 'outer_diameter', col: 2});
	form.endl();
	form.addInput({title: 'Densidade (kg/m3)', type: 'text', name: 'density', col: 2});
	form.addInput({title: 'Módulo E (MPa)', type: 'text', name: 'mod_e', col: 2});
	form.addInput({title: 'Módulo G (MPa)', type: 'text', name: 'mod_g', col: 2});
	form.addButton({label: 'Enviar', col: 1, bg: 'submit', click: (button, form) => {
		const obj = {};
		form.find('[name]').each(function(){
			const input = $(this);
			const name = input.attr('name');
			let val = input.val();
			if (name !== 'name' && name !== 'desc') {
				val = parseFloat(val);
			}
			obj[name] = val;
		});
		form.close();
		onsubmit && onsubmit(obj);
	}});
	form.addButton({label: 'Cancelar', col: 1, click: (button, form) => {
		form.close();
	}});
	return form;
};

export const newAxis = () => {
	axisForm('Novo eixo', obj => {
		shell.addAxis(obj);
		shell.storeLocal();
	});
};

export const editAxis = (axis) => {
	const {id} = axis;
	const form = axisForm('Editar eixo', obj => {
		if (shell.updateAxis({id, ...obj})) {
			shell.storeLocal();
		}
	});
	form.find('[name]').each(function(){
		const input = $(this);
		const name = input.attr('name');
		input.val(axis[name]);
	});
};
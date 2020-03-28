import * as forms from './forms.js';

export const openNewAxisForm = () => {
	const form = forms.create().title('Novo eixo');
	form.addInput({title: 'Nome do eixo', type: 'text', name: 'nome', col: 2})
	form.addInput({title: 'Descrição', type: 'text', name: 'desc', col: 4})
	form.endl()
	form.addInput({title: 'Diâmetro interno (m)', type: 'text', name: 'inner_diameter', col: 2})
	form.addInput({title: 'Diâmetro externo (m)', type: 'text', name: 'inner_diameter', col: 2})
	form.endl()
	form.addInput({title: 'Densidade (kg/m3)', type: 'text', name: 'density', col: 2})
	form.addInput({title: 'Módulo E (MPa)', type: 'text', name: 'mod_e', col: 2})
	form.addInput({title: 'Módulo G (MPa)', type: 'text', name: 'mod_g', col: 2})
	form.addButton({label: 'Enviar', col: 1, bg: 'submit'})
	form.addButton({label: 'Cancelar', col: 1, click: (button, form) => {
		form.close();
	}})
};
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
};

// End of File
// ========================<-------------------------------------------->======================== //
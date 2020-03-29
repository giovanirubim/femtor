export const dump = (number, config = {}) => {
	const {
		
	} = config;
	return Math.round(number*100)/100;
};
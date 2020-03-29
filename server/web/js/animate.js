// ========================<-------------------------------------------->======================== //
// Cria uma animação

// step: função executada a cada passo da animação
// duration: duração da animação
// finish: função executada ao final da animação
// retorna um objeto contendo os métodos stop (para a animação, não chama o finish) e finish
// (pula para o final da animação), e as flags booleanas finished e running
const animate = (step, duration = 750, finish) => {
	const ini = new Date();
	let interval = setInterval(() => {
		if (interval === null) return;
		const t = Math.min(1, (new Date() - ini)/duration);
		step(t);
		if (t === 1 && interval !== null) {
			clearInterval(null);
			result.running = false;
			interval = null;
			if (finish) {
				finish();
			}
			result.finished = true;
		}
	}, 0);
	const result = {
		stop: () => {
			if (interval === null) {
				return false;
			}
			clearInterval(interval);
			result.running = false;
			interval = null;
			return true;
		},
		finish: () => {
			if (interval === null) {
				return false;
			}
			step(1);
			if (interval === null) {
				return false;
			}
			clearInterval(interval);
			result.running = false;
			interval = null;
			if (finish) {
				finish();
			}
			result.finished = true;
			return true;
		},
		finished: false,
		running: true
	}
	return result;
};
export default animate;

// End of File
// ========================<-------------------------------------------->======================== //
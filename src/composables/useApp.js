export function useApp() {
	function isOJS() {
		return pkp.context.app === 'ojs2';
	}
	function isOMP() {
		return pkp.context.app === 'omp';
	}
	function isOPS() {
		return pkp.context.app === 'ops';
	}

	return {isOJS, isOMP, isOPS};
}

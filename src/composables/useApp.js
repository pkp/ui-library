/**
 * Provides functions to check which PKP application is currently running
 */
export function useApp() {
	/**
	 * Check if the current application is Open Journal Systems
	 * @returns {boolean} True if the application is OJS
	 */
	function isOJS() {
		return pkp.context.app === 'ojs2';
	}

	/**
	 * Check if the current application is Open Monograph Press
	 * @returns {boolean} True if the application is OMP
	 */
	function isOMP() {
		return pkp.context.app === 'omp';
	}

	/**
	 * Check if the current application is Open Preprint Systems
	 * @returns {boolean} True if the application is OPS
	 */
	function isOPS() {
		return pkp.context.app === 'ops';
	}

	return {isOJS, isOMP, isOPS};
}

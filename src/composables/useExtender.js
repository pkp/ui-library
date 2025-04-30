/**
 * Provides functions to extend and enhance existing functions
 */
export function useExtender({context} = {context: {}}) {
	/**
	 * Collection of functions that can be extended
	 * @type {Object<string, Function>}
	 */
	const availableFunctions = {};

	/**
	 * Add functions that can be extended
	 * @param {Object<string, Function>} extendableFns - Object containing functions that can be extended
	 * @returns {Object<string, Function>} The updated collection of available functions
	 */
	function addFns(extendableFns) {
		Object.keys(extendableFns).forEach((fnName) => {
			availableFunctions[fnName] = extendableFns[fnName];
		});

		return availableFunctions;
	}

	/**
	 * Extend an existing function with additional functionality
	 * @param {string} fnName - The name of the function to extend
	 * @param {Function} extendingFn - The function that will extend the original
	 * @param {*} extendingFn.originalResult - The result from the original function
	 * @param {...*} extendingFn.args - The original arguments passed to the function
	 */
	function extendFn(fnName, extendingFn) {
		const originalFn = availableFunctions[fnName];

		availableFunctions[fnName] = (...args) => {
			const originalResult = originalFn(...args);
			return extendingFn(originalResult, ...args, context);
		};
	}

	/**
	 * Get a list of all extendable function names
	 * @returns {Array<string>} Array of function names that can be extended
	 */
	function listExtendableFns() {
		return Object.keys(availableFunctions);
	}

	return {addFns, extendFn, listExtendableFns};
}

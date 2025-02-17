export function useExtender() {
	const availableFunctions = {};

	function addFns(extendableFns) {
		console.log('addFns:', Object.keys(extendableFns));
		Object.keys(extendableFns).forEach((fnName) => {
			availableFunctions[fnName] = extendableFns[fnName];
		});

		return availableFunctions;
	}

	function extendFn(fnName, extendingFn) {
		const originalFn = availableFunctions[fnName];

		availableFunctions[fnName] = (...args) => {
			const originalResult = originalFn(...args);
			return extendingFn(originalResult, ...args);
		};
	}

	function listExtendableFns() {
		return Object.keys(availableFunctions);
	}

	return {addFns, extendFn, listExtendableFns};
}

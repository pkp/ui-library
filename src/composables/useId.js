let id = 0;
function generateId(componentName) {
	return `pkp-id-${++id}`;
}

export function useId() {
	return {generateId};
}

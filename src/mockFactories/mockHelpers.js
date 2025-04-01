export function isObject(variable) {
	return (
		typeof variable === 'object' &&
		variable !== null &&
		!Array.isArray(variable)
	);
}

export function deepMerge(target, source) {
	for (const key of Object.keys(source)) {
		if (
			isObject(source[key]) &&
			isObject(target[key]) &&
			!Array.isArray(source[key])
		) {
			// Special case for multilingual fields
			if (
				!isObject(source[key].en) &&
				target[key]?.en !== undefined &&
				typeof source[key] !== 'object'
			) {
				target[key] = {...target[key], en: source[key]};
			} else {
				target[key] = deepMerge({...target[key]}, source[key]);
			}
		} else {
			target[key] = source[key];
		}
	}
	return target;
}

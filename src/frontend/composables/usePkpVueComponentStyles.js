/**
 * Global styles for Vue components
 *
 * Styles registered here apply to every instance of a Vue component on the
 * page, as the lowest priority layer of usePkpStyles: below styles passed down
 * by ancestor components and below the component's own `styles` prop. They
 * only affect Vue components styled via usePkpStyles, not Blade components or
 * server-rendered markup.
 *
 * Register styles before the Vue apps mount on DOMContentLoaded, for example
 * from a script at the end of <body>. Styles registered later are not reliably
 * applied.
 */
const registeredStyles = {};

/**
 * Deep merge styles objects, values from override win
 */
export function mergeStyles(base, override) {
	if (!base) return override || {};
	if (!override) return base || {};

	const result = {...base};
	for (const [key, value] of Object.entries(override)) {
		if (
			typeof value === 'object' &&
			value !== null &&
			typeof result[key] === 'object' &&
			result[key] !== null
		) {
			result[key] = mergeStyles(result[key], value);
		} else {
			result[key] = value;
		}
	}
	return result;
}

/**
 * Remove all registered styles. Not part of the public API, used to isolate
 * tests and Storybook stories.
 */
export function resetVueComponentStyles() {
	for (const componentName of Object.keys(registeredStyles)) {
		delete registeredStyles[componentName];
	}
}

export function usePkpVueComponentStyles() {
	return {
		/**
		 * Register styles for Vue components. Merged with previously registered
		 * styles per component, element and nested component key.
		 * @param {Object<string, Object>} stylesByComponent - Styles keyed by component name, e.g.
		 *  {CrossrefCitedByBody: {count: 'text-grey', PkpButton: {root: 'btn'}}}
		 */
		addStyles(stylesByComponent) {
			for (const [componentName, styles] of Object.entries(stylesByComponent)) {
				registeredStyles[componentName] = mergeStyles(
					registeredStyles[componentName],
					styles,
				);
			}
		},

		/**
		 * Get the styles registered for a component
		 * @param {string} componentName
		 * @returns {Object}
		 */
		getStyles(componentName) {
			return registeredStyles[componentName] ?? {};
		},
	};
}

import {inject, provide} from 'vue';

// Global key for cross-component nested styles
const NESTED_STYLES_KEY = Symbol.for('pkpNestedStyles');

/**
 * Check if a style key refers to a nested component (PascalCase starting with Pkp)
 */
function isComponentStyleKey(key) {
	return typeof key === 'string' && /^Pkp[A-Z]/.test(key);
}

/**
 * Extract element styles (camelCase keys) from a styles object
 */
function extractElementStyles(styles) {
	if (!styles) return {};
	const result = {};
	for (const [key, value] of Object.entries(styles)) {
		if (!isComponentStyleKey(key)) {
			result[key] = value;
		}
	}
	return result;
}

/**
 * Extract nested component styles (PascalCase keys starting with Pkp) from a styles object
 */
function extractNestedStyles(styles) {
	if (!styles) return {};
	const result = {};
	for (const [key, value] of Object.entries(styles)) {
		if (isComponentStyleKey(key) && typeof value === 'object') {
			result[key] = value;
		}
	}
	return result;
}

/**
 * Deep merge nested styles objects
 */
function mergeNestedStyles(base, override) {
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
			result[key] = mergeNestedStyles(result[key], value);
		} else {
			result[key] = value;
		}
	}
	return result;
}

export function usePkpStyles(componentName, localStyles = {}) {
	// No componentName = no BEM classes
	if (!componentName) {
		return {cn: () => '', nestedStyles: {}};
	}

	// Namespaced injection key - unique per componentName family
	const STYLES_KEY = Symbol.for(`pkpStyles:${componentName}`);

	// Inject parent context (only from same componentName family)
	const parentContext = inject(STYLES_KEY, null);

	// Inject nested styles from ancestor components
	const ancestorNestedStyles = inject(NESTED_STYLES_KEY, null);

	// Get styles meant for this component from ancestor's nested styles
	const injectedStyles = ancestorNestedStyles?.[componentName] || {};
	const injectedElementStyles = extractElementStyles(injectedStyles);
	const injectedNestedStyles = extractNestedStyles(injectedStyles);

	// Extract element and nested styles from local styles
	const localElementStyles = extractElementStyles(localStyles);
	const localNestedStyles = extractNestedStyles(localStyles);

	// Merge nested styles: ancestor's pass-through + injected nested + local nested
	// This allows styles to cascade through component hierarchies
	const passThrough = {...ancestorNestedStyles};
	delete passThrough[componentName]; // Remove styles consumed by this component

	const mergedNestedStyles = mergeNestedStyles(
		mergeNestedStyles(passThrough, injectedNestedStyles),
		localNestedStyles,
	);

	// Provide context to children of same family
	if (Object.keys(localElementStyles).length > 0) {
		provide(STYLES_KEY, {localStyles: localElementStyles});
	}

	// Provide nested styles to all descendants
	if (Object.keys(mergedNestedStyles).length > 0) {
		provide(NESTED_STYLES_KEY, mergedNestedStyles);
	}

	function cn(element = 'root', options = {}) {
		const {modifier = null} = options;
		const classes = [];

		// Generate BEM class
		let bemClass =
			element === 'root' ? componentName : `${componentName}__${element}`;
		if (modifier) bemClass += `--${modifier}`;
		classes.push(bemClass);

		// Get global styles from pkp.componentStyles
		const globalStyles =
			window.pkp?.componentStyles?.[componentName]?.[element];

		// Get injected styles from ancestor components (nested styles mechanism)
		const injectedValue = injectedElementStyles?.[element];

		// Get local styles (parent context first, then own)
		const contextStyles = parentContext?.localStyles?.[element];
		const localValue = localElementStyles?.[element] || contextStyles;

		// Determine if we're in override mode (! prefix on local value)
		const isOverride =
			typeof localValue === 'string' && localValue.startsWith('!');
		const localClasses = isOverride ? localValue.slice(1) : localValue;

		// Style cascade precedence (lowest to highest):
		// 1. Global styles (window.pkp.componentStyles)
		// 2. Injected nested styles (from ancestor components)
		// 3. Same-family context styles (existing behavior)
		// 4. Direct props.styles (highest priority)
		//
		// Override (!) replaces all lower-priority styles
		if (isOverride) {
			if (localClasses) classes.push(localClasses);
		} else {
			if (globalStyles) classes.push(globalStyles);
			if (injectedValue) classes.push(injectedValue);
			if (localClasses) classes.push(localClasses);
		}

		return classes.join(' ').trim();
	}

	return {cn, nestedStyles: mergedNestedStyles};
}

import {getCurrentInstance, inject, provide} from 'vue';

// Injection key for styling context
const PKP_STYLES_CONTEXT = Symbol('pkpStylesContext');

export function usePkpStyles(localStyles = {}) {
	const instance = getCurrentInstance();
	const ownComponentName = instance?.type.name || instance?.type.__name || null;

	// Automatic behavior based on naming convention:
	// - Pkp* components provide context
	// - Other components (Base*, etc.) inject context
	const isPkpComponent = ownComponentName?.startsWith('Pkp');

	// Try to inject parent context (for non-Pkp components)
	const parentContext = inject(PKP_STYLES_CONTEXT, null);

	// Determine which component name to use for BEM classes
	// Pkp* components use their own name; others use parent context if available
	const componentName = isPkpComponent
		? ownComponentName
		: parentContext?.componentName || ownComponentName;

	if (!componentName) {
		return {cn: () => ''};
	}

	// Pkp* components automatically provide context to children
	if (isPkpComponent) {
		provide(PKP_STYLES_CONTEXT, {
			componentName: ownComponentName,
			localStyles,
		});
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

		// Get local styles (check parent context first, then own)
		const contextStyles = parentContext?.localStyles?.[element];
		const localValue = localStyles?.[element] || contextStyles;
		const isOverride =
			typeof localValue === 'string' && localValue.startsWith('!');
		const localClasses = isOverride ? localValue.slice(1) : localValue;

		// Merge: local override replaces global, otherwise extend
		if (isOverride) {
			if (localClasses) classes.push(localClasses);
		} else {
			if (globalStyles) classes.push(globalStyles);
			if (localClasses) classes.push(localClasses);
		}

		return classes.join(' ').trim();
	}

	return {cn};
}

import {inject, provide} from 'vue';

export function usePkpStyles(componentName, localStyles = {}) {
	// No componentName = no BEM classes
	if (!componentName) {
		return {cn: () => ''};
	}

	// Namespaced injection key - unique per componentName family
	const STYLES_KEY = Symbol.for(`pkpStyles:${componentName}`);

	// Inject parent context (only from same componentName family)
	const parentContext = inject(STYLES_KEY, null);

	// Provide context to children of same family
	provide(STYLES_KEY, {localStyles});

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

		// Get local styles (parent context first, then own)
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

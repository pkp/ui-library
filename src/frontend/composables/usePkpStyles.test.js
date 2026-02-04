import {describe, test, expect, beforeEach, vi} from 'vitest';
import {usePkpStyles} from './usePkpStyles.js';

// Mock Vue's inject and provide
const injectMap = new Map();
const provideMap = new Map();

vi.mock('vue', () => ({
	inject: (key, defaultValue) => {
		const symbolKey =
			typeof key === 'symbol' ? key.toString() : Symbol.for(key).toString();
		return injectMap.has(symbolKey) ? injectMap.get(symbolKey) : defaultValue;
	},
	provide: (key, value) => {
		const symbolKey =
			typeof key === 'symbol' ? key.toString() : Symbol.for(key).toString();
		provideMap.set(symbolKey, value);
	},
}));

beforeEach(() => {
	injectMap.clear();
	provideMap.clear();
	global.window = {pkp: {}};
});

describe('usePkpStyles - basic functionality', () => {
	test('returns empty string and empty nestedStyles for no componentName', () => {
		const {cn, nestedStyles} = usePkpStyles(null);
		expect(cn()).toBe('');
		expect(cn('trigger')).toBe('');
		expect(nestedStyles).toEqual({});
	});

	test('generates BEM class for root element', () => {
		const {cn} = usePkpStyles('PkpButton');
		expect(cn()).toBe('PkpButton');
		expect(cn('root')).toBe('PkpButton');
	});

	test('generates BEM class for named element', () => {
		const {cn} = usePkpStyles('PkpButton');
		expect(cn('trigger')).toBe('PkpButton__trigger');
		expect(cn('triggerLabel')).toBe('PkpButton__triggerLabel');
	});

	test('generates BEM class with modifier', () => {
		const {cn} = usePkpStyles('PkpButton');
		expect(cn('root', {modifier: 'primary'})).toBe('PkpButton--primary');
		expect(cn('trigger', {modifier: 'active'})).toBe(
			'PkpButton__trigger--active',
		);
	});
});

describe('usePkpStyles - local styles', () => {
	test('adds local styles to BEM class', () => {
		const {cn} = usePkpStyles('PkpButton', {
			root: 'bg-blue-500',
			trigger: 'px-4 py-2',
		});
		expect(cn('root')).toBe('PkpButton bg-blue-500');
		expect(cn('trigger')).toBe('PkpButton__trigger px-4 py-2');
	});

	test('override prefix replaces global styles', () => {
		global.window.pkp.componentStyles = {
			PkpButton: {
				root: 'bg-red-500',
			},
		};
		const {cn} = usePkpStyles('PkpButton', {
			root: '!bg-blue-500',
		});
		expect(cn('root')).toBe('PkpButton bg-blue-500');
	});
});

describe('usePkpStyles - global styles', () => {
	test('merges global styles with BEM class', () => {
		global.window.pkp.componentStyles = {
			PkpButton: {
				root: 'bg-primary text-white',
				trigger: 'font-bold',
			},
		};
		const {cn} = usePkpStyles('PkpButton');
		expect(cn('root')).toBe('PkpButton bg-primary text-white');
		expect(cn('trigger')).toBe('PkpButton__trigger font-bold');
	});

	test('local styles extend global styles', () => {
		global.window.pkp.componentStyles = {
			PkpButton: {
				root: 'bg-primary',
			},
		};
		const {cn} = usePkpStyles('PkpButton', {
			root: 'text-white',
		});
		expect(cn('root')).toBe('PkpButton bg-primary text-white');
	});
});

describe('usePkpStyles - nested component styles', () => {
	test('extracts element styles from mixed styles object', () => {
		const styles = {
			root: 'bg-blue-500',
			trigger: 'px-4',
			PkpIcon: {root: 'w-6'},
			PkpButton: {root: 'bg-red-500'},
		};

		const {cn} = usePkpStyles('PkpComponent', styles);

		// Element styles should be applied
		expect(cn('root')).toBe('PkpComponent bg-blue-500');
		expect(cn('trigger')).toBe('PkpComponent__trigger px-4');
	});

	test('provides nested styles to children', () => {
		const styles = {
			root: 'bg-blue-500',
			PkpIcon: {root: 'w-6 h-6'},
			PkpButton: {trigger: 'px-4'},
		};

		usePkpStyles('PkpParent', styles);

		// Check that nested styles were provided
		const nestedKey = Symbol.for('pkpNestedStyles').toString();
		const providedStyles = provideMap.get(nestedKey);

		expect(providedStyles).toBeDefined();
		expect(providedStyles.PkpIcon).toEqual({root: 'w-6 h-6'});
		expect(providedStyles.PkpButton).toEqual({trigger: 'px-4'});
	});

	test('child receives injected nested styles', () => {
		// Simulate parent providing nested styles
		const nestedKey = Symbol.for('pkpNestedStyles').toString();
		injectMap.set(nestedKey, {
			PkpIcon: {root: 'w-6 h-6', label: 'text-sm'},
		});

		const {cn} = usePkpStyles('PkpIcon');

		expect(cn('root')).toBe('PkpIcon w-6 h-6');
		expect(cn('label')).toBe('PkpIcon__label text-sm');
	});

	test('deep nesting passes through intermediate components', () => {
		// Simulate grandparent providing deeply nested styles
		const nestedKey = Symbol.for('pkpNestedStyles').toString();
		injectMap.set(nestedKey, {
			PkpParent: {
				root: 'bg-gray-100',
				PkpChild: {root: 'text-blue-500'},
			},
		});

		// Parent component receives styles and extracts its own + passes down
		usePkpStyles('PkpParent');

		// Check that child styles are passed through
		const providedStyles = provideMap.get(nestedKey);
		expect(providedStyles.PkpChild).toEqual({root: 'text-blue-500'});
	});

	test('local styles override injected nested styles', () => {
		const nestedKey = Symbol.for('pkpNestedStyles').toString();
		injectMap.set(nestedKey, {
			PkpButton: {root: 'bg-blue-500'},
		});

		const {cn} = usePkpStyles('PkpButton', {
			root: 'bg-red-500',
		});

		// Local style should come after injected (higher priority in cascade)
		expect(cn('root')).toBe('PkpButton bg-blue-500 bg-red-500');
	});

	test('override prefix in local styles replaces all lower priority', () => {
		global.window.pkp.componentStyles = {
			PkpButton: {root: 'bg-global'},
		};

		const nestedKey = Symbol.for('pkpNestedStyles').toString();
		injectMap.set(nestedKey, {
			PkpButton: {root: 'bg-injected'},
		});

		const {cn} = usePkpStyles('PkpButton', {
			root: '!bg-local-only',
		});

		// Override should replace global and injected
		expect(cn('root')).toBe('PkpButton bg-local-only');
	});
});

describe('usePkpStyles - style cascade precedence', () => {
	test('full cascade: global < injected < local', () => {
		global.window.pkp.componentStyles = {
			PkpButton: {root: 'global-class'},
		};

		const nestedKey = Symbol.for('pkpNestedStyles').toString();
		injectMap.set(nestedKey, {
			PkpButton: {root: 'injected-class'},
		});

		const {cn} = usePkpStyles('PkpButton', {
			root: 'local-class',
		});

		// Should be in order: BEM, global, injected, local
		expect(cn('root')).toBe(
			'PkpButton global-class injected-class local-class',
		);
	});
});

describe('usePkpStyles - nestedStyles return value', () => {
	test('returns nestedStyles from local styles', () => {
		const {nestedStyles} = usePkpStyles('PkpComments', {
			root: 'bg-white',
			PkpCommentReportDialog: {content: 'rounded-lg'},
			PkpButton: {root: 'bg-blue-500'},
		});

		expect(nestedStyles).toEqual({
			PkpCommentReportDialog: {content: 'rounded-lg'},
			PkpButton: {root: 'bg-blue-500'},
		});
	});

	test('returns merged nestedStyles from injected and local', () => {
		const nestedKey = Symbol.for('pkpNestedStyles').toString();
		injectMap.set(nestedKey, {
			PkpModal: {overlay: 'bg-black/50'},
			PkpButton: {root: 'px-4'},
		});

		const {nestedStyles} = usePkpStyles('PkpDialog', {
			PkpButton: {root: 'bg-blue-500'},
		});

		// Should merge injected and local
		expect(nestedStyles.PkpModal).toEqual({overlay: 'bg-black/50'});
		expect(nestedStyles.PkpButton).toEqual({root: 'bg-blue-500'});
	});

	test('returns empty object when no nested styles exist', () => {
		const {nestedStyles} = usePkpStyles('PkpButton', {
			root: 'bg-blue-500',
			trigger: 'px-4',
		});

		expect(nestedStyles).toEqual({});
	});

	test('nestedStyles can be used to pass styles to modals', () => {
		// Simulate a parent component with nested styles for a modal
		const {nestedStyles} = usePkpStyles('PkpComments', {
			root: 'max-w-2xl',
			PkpCommentReportDialog: {
				content: 'bg-white rounded-lg',
				PkpButton: {root: 'bg-red-500'},
			},
		});

		// The modal would receive these styles via bodyProps.styles
		const modalStyles = nestedStyles.PkpCommentReportDialog;
		expect(modalStyles).toEqual({
			content: 'bg-white rounded-lg',
			PkpButton: {root: 'bg-red-500'},
		});

		// A modal component could then use these styles
		injectMap.clear();
		provideMap.clear();
		const {cn: modalCn} = usePkpStyles('PkpCommentReportDialog', modalStyles);
		expect(modalCn('content')).toBe(
			'PkpCommentReportDialog__content bg-white rounded-lg',
		);
	});
});

describe('usePkpStyles - edge cases', () => {
	test('handles empty nested styles gracefully', () => {
		const {cn} = usePkpStyles('PkpButton', {});
		expect(cn('root')).toBe('PkpButton');
	});

	test('handles undefined local styles', () => {
		const {cn} = usePkpStyles('PkpButton', undefined);
		expect(cn('root')).toBe('PkpButton');
	});

	test('ignores non-Pkp PascalCase keys as element styles', () => {
		const {cn} = usePkpStyles('PkpButton', {
			MyCustomKey: 'should-be-element-style',
		});
		// Non-Pkp keys are treated as element styles
		expect(cn('MyCustomKey')).toBe(
			'PkpButton__MyCustomKey should-be-element-style',
		);
	});

	test('component styles must be objects', () => {
		const styles = {
			PkpIcon: 'not-an-object', // Should be ignored as nested style
		};

		usePkpStyles('PkpParent', styles);

		const nestedKey = Symbol.for('pkpNestedStyles').toString();
		const providedStyles = provideMap.get(nestedKey);

		// String value for component key should not be in nested styles
		expect(providedStyles?.PkpIcon).toBeUndefined();
	});
});

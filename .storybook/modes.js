export const allModes = {
	desktop: {
		viewport: 'large',
		theme: 'ltr',
	},
	'desktop rtl': {
		viewport: 'large',
		theme: 'rtl',
	},
	// for snapshotting scrollable areas with all content, like modals
	desktopLargeHeight: {
		theme: 'ltr',
		viewport: 'largeHeight',
	},
	'desktopLargeHeight rtl': {
		viewport: 'largeHeight',
		theme: 'rtl',
	},
	// for snapshotting very long scrollable areas, like modals with long forms
	desktopExtraLargeHeight: {
		theme: 'ltr',
		viewport: 'extraLargeHeight',
	},
	'desktopExtraLargeHeight rtl': {
		viewport: 'extraLargeHeight',
		theme: 'rtl',
	},
};

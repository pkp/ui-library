import {
	t,
	localize,
	localizeSubmission,
	getMomentLocale,
} from '@/utils/i18n.js';

function tk(translationKey) {
	return translationKey;
}

export function useLocalize() {
	return {
		t,
		tk,
		localize,
		localizeSubmission,
		getMomentLocale,
	};
}

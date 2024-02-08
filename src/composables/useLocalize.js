import {
	t,
	localize,
	localizeSubmission,
	getMomentLocale,
} from '@/utils/i18n.js';
/** Check detailed documentation in @/utils/i18n.js */
export function useLocalize() {
	return {
		t,
		localize,
		localizeSubmission,
		getMomentLocale,
	};
}

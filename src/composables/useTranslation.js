import {t, replaceLocaleParams, localize} from '@/utils/i18n.js';

export function useTranslation() {
	return {
		t,
		replaceLocaleParams,
		localize,
	};
}

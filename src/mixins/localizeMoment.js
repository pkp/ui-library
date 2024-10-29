/**
 * A mixin to map PKP locales to Moment.js locales
 *
 *  @see https://vuejs.org/v2/guide/mixins.html
 */
export default {
	methods: {
		/**
		 * Get the Moment.js locale for a PKP locale
		 *
		 * This only maps the locales that need to be translated.
		 * Most PKP locales work fine in Moment.js.
		 *
		 * @param {String} locale The PKP locale, eg - `sr_Cyrl`
		 */
		getMomentLocale(locale) {
			locale.replaceAll('_', '-').toLowerCase();
			const map = {
				'bs-latn': 'bs',
				hy: 'hy-am',
				'nb-no': 'nb',
				oc: 'oc-lnc',
				pa: 'pa-in',
				'pt-pt': 'pt',
				'sr-latn': 'sr',
				tl: 'tl-ph',
				ug: 'ug-cn',
				'zh-hans': 'zh-cn',
			};
			return map[locale] ?? locale;
		},
	},
};

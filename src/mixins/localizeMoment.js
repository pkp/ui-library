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
		 * @param {String} locale The PKP locale, eg - `sr_RS@cyrillic`
		 */
		getMomentLocale(locale) {
			const map = {
				'sr_RS@latin': 'sr',
				'sr_RS@cyrillic': 'sr-cyrl',
				'uz_UZ@latin': 'uz-latn',
			};

			return map[locale] ?? locale;
		},
	},
};

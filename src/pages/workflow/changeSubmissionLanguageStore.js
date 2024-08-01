import {inject} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useApiUrl} from '@/composables/useApiUrl';
import {useFetch} from '@/composables/useFetch';
import {useForm} from '@/composables/useForm';
import cloneDeep from 'clone-deep';

export const useChangeSubmissionLanguageStore = defineComponentStore(
	'changeSubmissionLanguage',
	(props) => {
		/**
		 * Variables
		 */

		const {
			apiUrl: {value: apiUrl},
		} = useApiUrl(
			`submissions/${props.submissionId}/publications/${props.publicationId}`,
		);

		const {
			form: {value: form},
			setValue,
		} = useForm(cloneDeep(props.form));
		// Set action api url
		form.action = apiUrl + '/changeLocale';

		const publicationTitle =
			props.form.fields[2].value[props.form.primaryLocale];

		const publicationProps = {};
		// Get publication props
		(async () => {
			const {data, fetch} = useFetch(apiUrl, {
				method: 'GET',
			});
			await fetch();
			Object.assign(publicationProps, data.value ?? {});
			delete publicationProps['locale'];
		})();

		const closeModal = inject('closeModal');

		/**
		 * Functions
		 */

		function closeSideModal() {
			closeModal();
		}

		/**
		 * Set form data
		 */
		const set = (_, data) => {
			Object.keys(data).forEach((key) => (form[key] = data[key]));
			const oldLocale = form.primaryLocale;
			const newLocale = data.fields?.[0].value ?? oldLocale;
			// Set fields when changing language
			if (newLocale !== oldLocale) {
				form.primaryLocale = newLocale;
				form.fields.forEach((f) => {
					if (publicationProps[f.name]) {
						setValue(
							f.name,
							publicationProps[f.name][newLocale] ?? publicationProps[f.name],
						);
						// i18n.js t doesn't seem to support variable as tranlation key
						// (i18nExtractKeys.vite.js: uiLocaleKeysBackend.json), using str.replace for now.
						f.description = f.description.replace(
							getLocaleName(oldLocale),
							getLocaleName(newLocale),
						);
					}
				});
			}
		};

		/**
		 * Form success
		 */
		const success = () => {
			location.reload();
		};

		return {closeSideModal, set, success, form, publicationTitle};

		/**
		 * Aux functions
		 */

		function getLocaleName(locale) {
			return form.fields[0].options.find(({value}) => value === locale).label;
		}
	},
);

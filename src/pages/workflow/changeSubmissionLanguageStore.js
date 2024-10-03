import {inject, ref} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useApiUrl} from '@/composables/useApiUrl';
import {useFetch} from '@/composables/useFetch';
import {useForm} from '@/composables/useForm';
import {useLocalize} from '@/composables/useLocalize';
import cloneDeep from 'clone-deep';

export const useChangeSubmissionLanguageStore = defineComponentStore(
	'changeSubmissionLanguage',
	(props) => {
		/**
		 * Variables and init data
		 */

		const {t, tk} = useLocalize();

		const DescriptionLocaleKeys = {
			title: tk(
				'submission.list.changeSubmissionLanguage.metadataDescription.title',
			),
			abstract: tk(
				'submission.list.changeSubmissionLanguage.metadataDescription.abstract',
			),
		};

		const {
			apiUrl: {value: publicationApiUrl},
		} = useApiUrl(
			`submissions/${props.submissionId}/publications/${props.publicationId}`,
		);

		const {
			form: {value: form},
			getValue,
			set,
			setValue,
		} = useForm(cloneDeep(props.form));
		// Set action api url
		form.action = publicationApiUrl + '/changeLocale';

		// Set initial value
		const publicationTitle = ref(getValue('title'));

		const publicationProps = {};
		// Get publication props
		getData();

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
		const setCustom = (_, data) => {
			set(_, data);
			const oldLocale = form.primaryLocale;
			const newLocale = getValue('locale');
			// Set fields when changing language
			if (newLocale !== oldLocale) {
				form.primaryLocale = newLocale;
				form.fields.forEach((field) => {
					if (publicationProps[field.name]) {
						setValue(
							field.name,
							publicationProps[field.name][newLocale] ??
								publicationProps[field.name],
						);
						field.description = t(DescriptionLocaleKeys[field.name], {
							language: getLocaleName(newLocale),
						});
					}
				});
			}
		};

		/**
		 * Form success
		 */
		const success = () => {
			window.location.reload();
		};

		return {closeSideModal, setCustom, success, form, publicationTitle};

		/**
		 * Aux functions
		 */

		async function getData() {
			const {data, fetch} = useFetch(publicationApiUrl, {
				method: 'GET',
			});
			await fetch();

			Object.assign(publicationProps, data.value ?? {});
			delete publicationProps['locale'];

			publicationTitle.value = data.value.title[props.form.primaryLocale];
		}

		function getLocaleName(locale) {
			return form.fields
				.find(({name}) => name === 'locale')
				.options.find(({value}) => value === locale).label;
		}
	},
);

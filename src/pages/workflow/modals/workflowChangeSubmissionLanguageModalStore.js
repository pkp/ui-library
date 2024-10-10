import {inject, ref, computed, watch} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useForm} from '@/composables/useForm';
import {useLocalize} from '@/composables/useLocalize';

export const useWorkflowChangeSubmissionLanguageModalStore =
	defineComponentStore('workflowChangeSubmissionLanguageModal', (props) => {
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
		} = useUrl(
			`submissions/${props.submissionId}/publications/${props.publicationId}`,
		);

		/**
		 * Form for changing language
		 */

		const relativeUrl = computed(() => {
			// this form is not related only to submission, not publication
			return `submissions/${props.submissionId}/publications/${props.publicationId}/_components/changeLanguageMetadata`;
		});
		const {apiUrl: publicationFormUrl} = useUrl(relativeUrl);
		const {data: changeSubmissionForm, fetch: fetchForm} =
			useFetch(publicationFormUrl);

		watch(
			publicationFormUrl,
			(newRelativeUrl, prevRelativeUrl) => {
				if (newRelativeUrl !== prevRelativeUrl) {
					fetchForm();
				}
			},
			{immediate: true},
		);

		const {form, getValue, set, setValue} = useForm(changeSubmissionForm);
		// Set action api url
		form.action = publicationApiUrl + '/changeLocale';

		// Set initial value

		const publicationTitle = ref('');

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
			const oldLocale = form.value.primaryLocale;
			const newLocale = getValue('locale');
			// Set fields when changing language
			if (newLocale !== oldLocale) {
				form.value.primaryLocale = newLocale;
				form.value.fields.forEach((field) => {
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
			const {data: publication, fetch: fetchPublication} = useFetch(
				publicationApiUrl,
				{
					method: 'GET',
				},
			);
			await fetchPublication();

			Object.assign(publicationProps, publication.value ?? {});
			delete publicationProps['locale'];

			publicationTitle.value =
				publication.value.fullTitle[publication.value.locale];
		}

		function getLocaleName(locale) {
			return form.value.fields
				.find(({name}) => name === 'locale')
				.options.find(({value}) => value === locale).label;
		}
	});

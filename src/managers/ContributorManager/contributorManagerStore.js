import {defineComponentStore} from '@/utils/defineComponentStore';

import {computed} from 'vue';
import {useUrl} from '@/composables/useUrl';
import {useLocalize} from '@/composables/useLocalize';
import {useForm} from '@/composables/useForm';
import {useDataChanged} from '@/composables/useDataChanged';
import {useDashboardPageStore} from '@/pages/dashboard/dashboardPageStore.js';

export const useContributorManagerStore = defineComponentStore(
	'contributorManager',
	(props) => {
		const {t} = useLocalize();

		const {apiUrl: publicationApiUrlFormat} = useUrl(
			`submissions/${props.submission.id}/publications/__publicationId__`,
		);

		const dashboardStore = useDashboardPageStore();

		const {form, setLocalesForSubmission} = useForm(
			dashboardStore.componentForms.contributorForm,
		);

		setLocalesForSubmission(props.submission);

		const {triggerDataChange} = useDataChanged();

		const contributorsListPanelProps = computed(() => {
			return {
				canEditPublication: props.canEdit,
				form: form.value,
				id: 'contributors',
				items: props.publication.authors,
				title: t('publication.contributors'),
				publicationApiUrlFormat: publicationApiUrlFormat.value,
				publication: props.publication,
				'onUpdated:publication': (publication) => {
					// TODO: Not good practice to update object coming from props
					// This currently ensures that optimistic updates implemented in ContributorListPanel still works
					// This should be addressed with larger refactor when adopting new ui and composition API
					Object.keys(publication).forEach((key) => {
						props.publication[key] = publication[key];
					});
					triggerDataChange();
				},
				'onUpdated:contributors': (contributors) => {
					props.publication.authors = contributors;
				},
			};
		});

		return {
			title: props.title,
			contributorsListPanelProps,
		};
	},
);

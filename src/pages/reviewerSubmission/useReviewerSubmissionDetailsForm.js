import {markRaw} from 'vue';
import {useForm} from '@/composables/useForm';
import {useFetch} from '@/composables/useFetch';
import {useLocalize} from '@/composables/useLocalize';
import {useUrl} from '@/composables/useUrl';
import DataCitationManager from '@/managers/DataCitationManager/DataCitationManager.vue';

/**
 * Fetches the publication and builds the read-only form of details shown to a reviewer.
 *
 * The API decides what is included - empty values are skipped.
 */
export function useReviewerSubmissionDetailsForm({
	submissionId,
	publicationId,
	dataCitationEditForm,
}) {
	const {t, localize} = useLocalize();

	const {apiUrl: publicationApiUrl} = useUrl(
		`submissions/${submissionId}/publications/${publicationId}`,
	);
	const {
		data: publicationData,
		isLoading: isLoadingPublication,
		fetch: fetchPublication,
	} = useFetch(publicationApiUrl);

	const {
		form,
		initEmptyForm,
		addPage,
		addGroup,
		addFieldText,
		addFieldHtml,
		addFieldControlledVocab,
		addFieldComponent,
	} = useForm({});

	initEmptyForm('reviewerSubmissionDetails', {canSubmit: false});
	addPage('default');
	addGroup('default');

	function addFields(publication) {
		addFieldHtml('title', {
			label: t('common.title'),
			value: localize(publication.fullTitle),
		});

		if (publication.authorsString) {
			addFieldText('authors', {
				label: t('submission.authors'),
				value: publication.authorsString,
			});
		}

		addFieldHtml('abstract', {
			label: t('common.abstract'),
			value: localize(publication.abstract),
		});

		// The form is only sent when the journal has data citations enabled
		if (publication.dataCitations?.length && dataCitationEditForm?.fields) {
			addFieldComponent('dataCitations', {
				component: markRaw(DataCitationManager),
				componentProps: {
					submission: {id: submissionId},
					publication,
					dataCitationEditForm,
					canEdit: false,
				},
			});
		}

		const dataAvailability = localize(publication.dataAvailability);
		if (dataAvailability) {
			addFieldHtml('dataAvailability', {
				label: t('submission.dataAvailability'),
				value: dataAvailability,
			});
		}

		const fundingStatement = localize(publication.fundingStatement);
		if (fundingStatement) {
			addFieldHtml('fundingStatement', {
				label: t('submission.fundingStatement'),
				value: fundingStatement,
			});
		}

		const keywords = localize(publication.keywords);
		if (keywords.length) {
			addFieldControlledVocab('keywords', {
				label: t('common.keywords'),
				value: keywords,
			});
		}

		const subjects = localize(publication.subjects);
		if (subjects.length) {
			addFieldControlledVocab('subjects', {
				label: t('common.subjects'),
				value: subjects,
			});
		}

		const disciplines = localize(publication.disciplines);
		if (disciplines.length) {
			addFieldControlledVocab('disciplines', {
				label: t('common.discipline'),
				value: disciplines,
			});
		}
	}

	fetchPublication().then(() => {
		if (publicationData.value) {
			addFields(publicationData.value);
		}
	});

	return {form, isLoading: isLoadingPublication};
}

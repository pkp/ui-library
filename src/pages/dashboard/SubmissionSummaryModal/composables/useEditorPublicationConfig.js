import {useLocalize} from '@/composables/useLocalize';
import {Actions} from '../../composables/useWorkflowActions';
import {useSubmission} from '@/composables/useSubmission';
export const PublicationConfig = {
	titleAbstract: {
		getPrimaryItems: ({submission, selectedPublication, pageInitConfig}) => {
			return [
				{
					component: 'PublicationTitleAbstractForm',
					props: {
						form: pageInitConfig.publicationTitleAbstractForm,
						sections: pageInitConfig.sections,
						submission,
						publication: selectedPublication,
					},
				},
			];
		},
	},
	contributors: {
		getPrimaryItems: ({submission, selectedPublication, pageInitConfig}) => {
			return [
				{
					component: 'ContributorManager',
					props: {
						submissionId: submission.id,
						publication: selectedPublication,
						contributorForm: {},
					},
				},
			];
		},
	},
	metadata: {
		getPrimaryItems: ({submission, selectedPublication, pageInitConfig}) => {
			return [
				{
					component: 'PublicationTitleAbstractForm',
					props: {
						form: pageInitConfig.publicationMetadataForm,
						submission,
						publication: selectedPublication,
					},
				},
			];
		},
	},
	citations: {
		getPrimaryItems: ({submission, selectedPublication, pageInitConfig}) => {
			return [
				{
					component: 'PublicationTitleAbstractForm',
					props: {
						form: pageInitConfig.publicationCitationsForm,
						sections: pageInitConfig.sections,
						submission,
						publication: selectedPublication,
					},
				},
			];
		},
	},
};

export function useEditorPublicationConfig() {
	function getPrimaryItems(args) {
		const items = [];
		if (args.selectedPublication.status === pkp.const.STATUS_PUBLISHED) {
			items.push({
				component: 'PublicationEditDisabled',
				props: {},
			});
		}

		return [
			...items,
			...PublicationConfig[args.selectedPublicationMenu].getPrimaryItems(args),
		];
	}

	function getPublicationControlsLeft({
		submission,
		selectedPublicationId,
		selectedPublication,
	}) {
		const items = [];

		items.push({
			component: 'PublicationVersionControl',
			props: {
				submission,
				selectedPublicationId: selectedPublicationId,
			},
		});
		return items;
	}

	function getPublicationControlsRight({
		submission,
		selectedPublicationId,
		selectedPublication,
	}) {
		const items = [];
		const {t} = useLocalize();

		if (selectedPublication.status === pkp.const.STATUS_QUEUED) {
			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.preview'),
					isSecondary: true,
					action: Actions.PREVIEW_PUBLICATION,
				},
			});

			items.push({
				component: 'ActionButton',
				props: {
					label: t('editor.submission.schedulePublication'),
					isSecondary: true,
					action: Actions.ASSIGN_TO_ISSUE_AND_SCHEULE_FOR_PUBLICATION,
				},
			});
		} else if (selectedPublication.status === pkp.const.STATUS_SCHEDULED) {
			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.preview'),
					isSecondary: true,
					action: Actions.PREVIEW_PUBLICATION,
				},
			});

			items.push({
				component: 'ActionButton',
				props: {
					label: t('publication.unschedule'),
					isWarnable: true,
					action: Actions.UNSCHEDULE_PUBLICATION,
				},
			});
		} else if (selectedPublication.status === pkp.const.STATUS_PUBLISHED) {
			items.push({
				component: 'ActionButton',
				props: {
					label: t('publication.unpublish'),
					isWarnable: true,
					action: Actions.UNPUBLISH_PUBLICATION,
				},
			});

			const {getLatestPublication} = useSubmission();
			const latestPublication = getLatestPublication(submission);

			if (latestPublication.id === selectedPublication.id) {
				items.push({
					component: 'ActionButton',
					props: {
						label: t('publication.createVersion'),
						isSecondary: true,
						action: Actions.CREATE_NEW_VERSION,
					},
				});
			}
		}

		return items;
	}

	return {
		getPrimaryItems,
		getPublicationControlsLeft,
		getPublicationControlsRight,
	};
}

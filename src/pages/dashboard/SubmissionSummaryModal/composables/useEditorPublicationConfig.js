import {useLocalize} from '@/composables/useLocalize';
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
		return PublicationConfig[args.selectedPublicationMenu].getPrimaryItems(
			args,
		);
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
		items.push({
			component: 'ActionButton',
			props: {
				label: t('dashboard.summary.scheduleForPublication'),
				isPrimary: true,
				//action: 'scheduleForPublication',
				action: 'assignToIssueAndScheduleForPublication',
			},
		});

		return items;
	}

	return {
		getPrimaryItems,
		getPublicationControlsLeft,
		getPublicationControlsRight,
	};
}

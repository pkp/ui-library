import {useSubmission} from '@/composables/useSubmission';
import {useLocalize} from '@/composables/useLocalize';
export function useSummarySideNav() {
	const {t, tk} = useLocalize();

	function getWorkflowTitle(stageId) {
		const StageTitles = {
			[pkp.const.WORKFLOW_STAGE_ID_SUBMISSION]: tk(
				'dashboard.stage.submission',
			),
			[pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW]: tk(
				'dashboard.stage.review',
			),
			[pkp.const.WORKFLOW_STAGE_ID_EDITING]: tk('dashboard.stage.copyediting'),
			[pkp.const.WORKFLOW_STAGE_ID_PRODUCTION]: tk(
				'dashboard.stage.production',
			),
		};

		return `${t('comma', {value: t('manager.workflow')})} ${StageTitles[stageId]} `;
	}

	function getPublicationTitle(publicationMenuTitle) {
		return `${t('comma', {value: t('submission.publication')})} ${publicationMenuTitle}`;
	}

	function getReviewItems(submission) {
		const {getActiveStage, getCurrentReviewRound} = useSubmission();

		const activeStage = getActiveStage(submission);

		const activeReviewRound = getCurrentReviewRound(
			submission,
			pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
		);

		const reviewMenuItems = [];

		const {getReviewRoundsForStage} = useSubmission();
		const reviewRounds = getReviewRoundsForStage(
			submission,
			pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
		);

		reviewRounds.forEach((reviewRound, index) => {
			reviewMenuItems.push({
				key: `workflow_${pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW}_${reviewRound.id}`,
				label: `Review Round ${index + 1}`,
				colorStripe:
					(activeStage.id === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW &&
						activeReviewRound.id) === reviewRound.id
						? 'border-stage-in-review'
						: null,

				action: 'selectStage',
				actionArgs: {
					reviewRoundId: reviewRound.id,
					stageId: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
				},
			});
		});

		/*if (submission.stageId === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW) {
			reviewMenuItems.push({
				label: 'New Review Round',
				action: 'decisionNewExternalRound',
				actionArgs: {
					reviewRoundId: getCurrentReviewRound(
						submission,
						pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
					).id,
					stageId: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
				},
			});
		}*/

		return reviewMenuItems;
	}

	function getWorkflowItems(submission) {
		const {getActiveStage} = useSubmission();

		const activeStage = getActiveStage(submission);

		const externalReviewItems = getReviewItems(submission);
		return [
			{
				key: `workflow_${pkp.const.WORKFLOW_STAGE_ID_SUBMISSION}`,
				label: 'Submission',
				title: getWorkflowTitle(pkp.const.WORKFLOW_STAGE_ID_SUBMISSION),
				colorStripe:
					activeStage.id === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION
						? 'border-stage-desk-review'
						: null,
				action: 'selectStage',
				actionArgs: {stageId: pkp.const.WORKFLOW_STAGE_ID_SUBMISSION},
			},
			{
				key: `workflow_${pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW}`,
				label: 'Review',
				title: getWorkflowTitle(pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW),
				colorStripe:
					activeStage.id === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW
						? 'border-stage-in-review'
						: null,

				items: externalReviewItems,
				action: !externalReviewItems.length ? 'selectStage' : undefined,
				actionArgs: !externalReviewItems.length
					? {stageId: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW}
					: undefined,
			},
			{
				key: `workflow_${pkp.const.WORKFLOW_STAGE_ID_EDITING}`,
				label: 'Copyediting',
				title: getWorkflowTitle(pkp.const.WORKFLOW_STAGE_ID_EDITING),
				colorStripe:
					activeStage.id === pkp.const.WORKFLOW_STAGE_ID_EDITING
						? 'border-stage-copyediting'
						: null,
				action: 'selectStage',
				actionArgs: {stageId: pkp.const.WORKFLOW_STAGE_ID_EDITING},
			},
			{
				key: `workflow_${pkp.const.WORKFLOW_STAGE_ID_PRODUCTION}`,
				label: 'Production',
				title: getWorkflowTitle(pkp.const.WORKFLOW_STAGE_ID_PRODUCTION),
				colorStripe:
					activeStage.id === pkp.const.WORKFLOW_STAGE_ID_PRODUCTION
						? 'border-stage-copyediting'
						: null,
				action: 'selectStage',
				actionArgs: {stageId: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION},
			},
		];
	}

	function getMenuItems(submission) {
		const menuItems = [
			{
				key: 'workflow',
				label: 'Workflow',
				icon: 'Dashboard',
				items: getWorkflowItems(submission),
			},
			{
				key: 'publication',
				label: 'Publication',
				icon: 'MySubmissions',
				items: [
					{
						key: 'publication_titleAbstract',
						label: t('publication.titleAbstract'),
						title: getPublicationTitle(t('publication.titleAbstract')),
						action: 'selectPublicationMenu',
						actionArgs: {publicationMenu: 'titleAbstract'},
					},
					{
						label: t('publication.contributors'),
						title: getPublicationTitle(t('publication.contributors')),
						action: 'selectPublicationMenu',
						actionArgs: {publicationMenu: 'contributors'},
					},
					{
						key: 'publication_metadata',
						label: t('article.metadata'),
						title: getPublicationTitle(t('article.metadata')),
						action: 'selectPublicationMenu',
						actionArgs: {publicationMenu: 'metadata'},
					},
					{
						key: 'citations',
						label: t('submission.citations'),
						title: getPublicationTitle(t('submission.citation')),

						action: 'selectPublicationMenu',
						actionArgs: {publicationMenu: 'citations'},
					},
					{
						label: 'Galleys',
						link: '#',
					},
					{
						label: 'Permissions & Disclosure',
						link: '#',
					},
					{
						label: 'Issue',
						link: '#',
					},
				],
			},
		];

		return menuItems;
	}

	function getTitle(itemKey) {
		if (itemKey.startsWith('publication_')) {
			return `${t('semicolon', {value: t('submission.publication')})}`;
		}
	}

	return {getMenuItems, getTitle};
}

import {useSubmission} from '@/composables/useSubmission';
import {useLocalize} from '@/composables/useLocalize';
import {DashboardPageTypes} from '@/pages/dashboard/dashboardPageStore';
export function useWorkflowNavigationConfig(pageInitConfig) {
	const {publicationSettings} = pageInitConfig;
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

		return `${t('semicolon', {label: t('manager.workflow')})} ${t(StageTitles[stageId])} `;
	}

	function getPublicationTitle(publicationMenuTitle) {
		return `${t('semicolon', {label: t('submission.publication')})} ${publicationMenuTitle}`;
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
					title: getWorkflowTitle(pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW),
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
				colorStripe:
					activeStage.id === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION
						? 'border-stage-desk-review'
						: null,
				action: 'selectStage',
				actionArgs: {
					stageId: pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
					title: getWorkflowTitle(pkp.const.WORKFLOW_STAGE_ID_SUBMISSION),
				},
			},
			{
				key: `workflow_${pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW}`,
				label: 'Review',
				colorStripe:
					activeStage.id === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW
						? 'border-stage-in-review'
						: null,

				items: externalReviewItems,
				action: !externalReviewItems.length ? 'selectStage' : undefined,
				actionArgs: !externalReviewItems.length
					? {
							stageId: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
							title: getWorkflowTitle(
								pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
							),
						}
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
				actionArgs: {
					stageId: pkp.const.WORKFLOW_STAGE_ID_EDITING,
					title: getWorkflowTitle(pkp.const.WORKFLOW_STAGE_ID_EDITING),
				},
			},
			{
				key: `workflow_${pkp.const.WORKFLOW_STAGE_ID_PRODUCTION}`,
				label: 'Production',
				title: getWorkflowTitle(pkp.const.WORKFLOW_STAGE_ID_PRODUCTION),
				colorStripe:
					activeStage.id === pkp.const.WORKFLOW_STAGE_ID_PRODUCTION &&
					submission.status === pkp.const.STATUS_QUEUED
						? 'border-stage-copyediting'
						: null,
				action: 'selectStage',
				actionArgs: {
					stageId: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
					title: getWorkflowTitle(pkp.const.WORKFLOW_STAGE_ID_PRODUCTION),
				},
			},
		];
	}

	function getPublicationItemsAuthor(submission) {
		const items = [];

		items.push({
			key: 'publication_titleAbstract',
			label: t('publication.titleAbstract'),
			action: 'selectPublicationMenu',
			actionArgs: {
				publicationMenu: 'titleAbstract',
				title: getPublicationTitle(t('publication.titleAbstract')),
			},
		});

		items.push({
			key: 'publication_contributors',
			label: t('publication.contributors'),
			action: 'selectPublicationMenu',
			actionArgs: {
				publicationMenu: 'contributors',
				title: getPublicationTitle(t('publication.contributors')),
			},
		});

		items.push({
			key: 'publication_metadata',
			label: t('article.metadata'),
			action: 'selectPublicationMenu',
			actionArgs: {
				publicationMenu: 'metadata',
				title: getPublicationTitle(t('article.metadata')),
			},
		});

		if (publicationSettings.supportsCitations) {
			items.push({
				key: 'citations',
				label: t('submission.citations'),
				action: 'selectPublicationMenu',
				actionArgs: {
					publicationMenu: 'citations',
					title: getPublicationTitle(t('submission.citations')),
				},
			});
		}

		// TODO: REAL VALUE
		const canAccessProductionStage = true;
		if (canAccessProductionStage) {
			items.push({
				key: 'galleys',
				label: t('submission.layout.galleys'),
				action: 'selectPublicationMenu',
				actionArgs: {
					publicationMenu: 'galleys',
					title: getPublicationTitle(t('submission.layout.galleys')),
				},
			});
		}

		return items;
	}

	function getPublicationItemsEditorial(submission) {
		const items = [];

		items.push({
			key: 'publication_titleAbstract',
			label: t('publication.titleAbstract'),
			action: 'selectPublicationMenu',
			actionArgs: {
				publicationMenu: 'titleAbstract',
				title: getPublicationTitle(t('publication.titleAbstract')),
			},
		});

		items.push({
			key: 'publication_contributors',
			label: t('publication.contributors'),
			action: 'selectPublicationMenu',
			actionArgs: {
				publicationMenu: 'contributors',
				title: getPublicationTitle(t('publication.contributors')),
			},
		});

		items.push({
			key: 'publication_metadata',
			label: t('article.metadata'),
			action: 'selectPublicationMenu',
			actionArgs: {
				publicationMenu: 'metadata',
				title: getPublicationTitle(t('article.metadata')),
			},
		});

		if (publicationSettings.supportsCitations) {
			items.push({
				key: 'citations',
				label: t('submission.citations'),
				action: 'selectPublicationMenu',
				actionArgs: {
					publicationMenu: 'citations',
					title: getPublicationTitle(t('submission.citations')),
				},
			});
		}

		if (publicationSettings.identifiersEnabled) {
			items.push({
				key: 'identifiers',
				label: t('submission.identifiers'),
				action: 'selectPublicationMenu',
				actionArgs: {
					publicationMenu: 'identifiers',
					title: getPublicationTitle(t('submission.identifiers')),
				},
			});
		}

		items.push({
			key: 'jats',
			label: t('publication.jats'),
			action: 'selectPublicationMenu',
			actionArgs: {
				publicationMenu: 'jats',
				title: getPublicationTitle(t('publication.jats')),
			},
		});

		items.push({
			key: 'galleys',
			label: t('submission.layout.galleys'),
			action: 'selectPublicationMenu',
			actionArgs: {
				publicationMenu: 'galleys',
				title: getPublicationTitle(t('submission.layout.galleys')),
			},
		});

		items.push({
			label: t('publication.publicationLicense'),
			key: 'license',
			action: 'selectPublicationMenu',
			actionArgs: {
				publicationMenu: 'license',
				title: getPublicationTitle(t('publication.publicationLicense')),
			},
		});

		items.push({
			label: t('issue.issue'),
			key: 'issue',
			action: 'selectPublicationMenu',
			actionArgs: {
				publicationMenu: 'issue',
				title: getPublicationTitle(t('issue.issue')),
			},
		});

		return items;
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
				items:
					pageInitConfig.dashboardPage ===
					DashboardPageTypes.EDITORIAL_DASHBOARD
						? getPublicationItemsEditorial(submission)
						: getPublicationItemsAuthor(submission),
			},
		];

		return menuItems;
	}

	return {getMenuItems};
}

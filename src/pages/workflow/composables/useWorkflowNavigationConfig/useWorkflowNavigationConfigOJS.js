import {useSubmission} from '@/composables/useSubmission';
import {useLocalize} from '@/composables/useLocalize';
import {DashboardPageTypes} from '@/pages/dashboard/dashboardPageStore';
const {getCurrentReviewRound} = useSubmission();

const {t} = useLocalize();

const StageColors = {
	[pkp.const.WORKFLOW_STAGE_ID_SUBMISSION]: 'border-stage-desk-review',
	[pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW]: 'border-stage-in-review',
	[pkp.const.WORKFLOW_STAGE_ID_EDITING]: 'border-stage-copyediting',
	[pkp.const.WORKFLOW_STAGE_ID_PRODUCTION]: 'border-stage-production',
};

export function getPublicationItem({label, name}) {
	return {
		key: `publication_${name}`,
		label: label,
		action: 'selectMenu',
		actionArgs: {
			primaryMenuItem: 'publication',
			secondaryMenuItem: name,
			title: getPublicationTitle(label),
		},
	};
}

export function getWorkflowItem({stageId, label, isActive, isDisabled, items}) {
	return {
		key: `workflow_${stageId}`,
		label: label,
		colorStripe: isActive ? StageColors[stageId] : null,
		action: isDisabled ? undefined : 'selectMenu',
		actionArgs: {
			primaryMenuItem: 'workflow',
			stageId: stageId,
			title: getWorkflowTitle(label),
		},
		items,
	};
}

export function getWorkflowTitle(stageLabel) {
	return `${t('semicolon', {label: t('manager.workflow')})} ${stageLabel} `;
}

export function getPublicationTitle(publicationMenuTitle) {
	return `${t('semicolon', {
		label: t('submission.publication'),
	})} ${publicationMenuTitle}`;
}

export function getReviewItems({submission, stageId, title}) {
	const {getActiveStage, getCurrentReviewRound} = useSubmission();

	const activeStage = getActiveStage(submission);

	const activeReviewRound = getCurrentReviewRound(submission, stageId);

	const reviewMenuItems = [];

	const {getReviewRoundsForStage} = useSubmission();
	const reviewRounds = getReviewRoundsForStage(submission, stageId);

	reviewRounds.forEach((reviewRound) => {
		reviewMenuItems.push(
			getReviewItem({
				stageId,
				reviewRound,
				isActive:
					activeStage.id === stageId && activeReviewRound.id === reviewRound.id,
				title: title,
			}),
		);
	});

	return reviewMenuItems;
}

export function getReviewItem({stageId, reviewRound, isActive, title}) {
	return {
		key: `workflow_${stageId}_${reviewRound.id}`,
		label: t('dashboard.workflow.reviewRoundN', {number: reviewRound.round}),
		colorStripe: isActive ? StageColors[stageId] : null,
		action: 'selectMenu',
		actionArgs: {
			primaryMenuItem: 'workflow',
			stageId: stageId,
			reviewRoundId: reviewRound.id,
			title: title,
		},
	};
}

export function useWorkflowNavigationConfigOJS(pageInitConfig) {
	const {publicationSettings} = pageInitConfig;
	const {t} = useLocalize();

	function getWorkflowItems({submission}) {
		const {getActiveStage} = useSubmission();

		const activeStage = getActiveStage(submission);

		const externalReviewItems = getReviewItems({
			submission,
			stageId: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
			title: t('dashboard.stage.review'),
		});

		const items = [];

		items.push(
			getWorkflowItem({
				stageId: pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
				label: t('dashboard.stage.submission'),
				isActive: activeStage.id === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
			}),
		);

		items.push(
			getWorkflowItem({
				stageId: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
				label: t('dashboard.stage.review'),
				isActive:
					activeStage.id === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
				isDisabled: externalReviewItems.length,
				items: externalReviewItems,
			}),
		);

		items.push(
			getWorkflowItem({
				stageId: pkp.const.WORKFLOW_STAGE_ID_EDITING,
				label: t('dashboard.stage.copyediting'),
				isActive: activeStage.id === pkp.const.WORKFLOW_STAGE_ID_EDITING,
			}),
		);

		items.push(
			getWorkflowItem({
				stageId: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
				label: t('dashboard.stage.production'),
				isActive: activeStage.id === pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
			}),
		);

		return items;
	}

	function getPublicationItemsAuthor({submission, permissions}) {
		const items = [];

		items.push(
			getPublicationItem({
				name: 'titleAbstract',
				label: t('publication.titleAbstract'),
			}),
		);

		items.push(
			getPublicationItem({
				name: 'contributors',
				label: t('publication.contributors'),
			}),
		);

		items.push(
			getPublicationItem({
				name: 'metadata',
				label: t('article.metadata'),
			}),
		);

		if (publicationSettings.supportsCitations) {
			items.push(
				getPublicationItem({
					name: 'citations',
					label: t('submission.citations'),
				}),
			);
		}

		if (permissions.canAccessProduction) {
			items.push(
				getPublicationItem({
					name: 'galleys',
					label: t('submission.layout.galleys'),
				}),
			);
		}

		return items;
	}

	function getPublicationItemsEditorial({submission, permissions}) {
		const items = [];

		items.push(
			getPublicationItem({
				name: 'titleAbstract',
				label: t('publication.titleAbstract'),
			}),
		);

		items.push(
			getPublicationItem({
				name: 'contributors',
				label: t('publication.contributors'),
			}),
		);

		items.push(
			getPublicationItem({
				name: 'metadata',
				label: t('article.metadata'),
			}),
		);

		if (publicationSettings.supportsCitations) {
			items.push(
				getPublicationItem({
					name: 'citations',
					label: t('submission.citations'),
				}),
			);
		}

		if (publicationSettings.identifiersEnabled) {
			items.push(
				getPublicationItem({
					name: 'identifiers',
					label: t('submission.identifiers'),
				}),
			);
		}

		items.push(
			getPublicationItem({
				name: 'jats',
				label: t('publication.jats'),
			}),
		);

		if (permissions.canAccessProduction) {
			items.push(
				getPublicationItem({
					name: 'galleys',
					label: t('submission.layout.galleys'),
				}),
			);

			items.push(
				getPublicationItem({
					name: 'license',
					label: t('publication.publicationLicense'),
				}),
			);

			items.push(
				getPublicationItem({
					name: 'issue',
					label: t('issue.issue'),
				}),
			);
		}

		return items;
	}

	function getMenuItems({submission, permissions}) {
		if (!submission) {
			return [];
		}

		const menuItems = [
			{
				key: 'workflow',
				label: t('manager.workflow'),
				icon: 'Dashboard',
				items: getWorkflowItems({submission, permissions}),
			},
			{
				key: 'publication',
				label: t('submission.publication'),
				icon: 'MySubmissions',
				items:
					pageInitConfig.dashboardPage ===
					DashboardPageTypes.EDITORIAL_DASHBOARD
						? getPublicationItemsEditorial({submission, permissions})
						: getPublicationItemsAuthor({submission, permissions}),
			},
		];

		return menuItems;
	}

	function getInitialSelectionItemKey(submission) {
		if (
			submission.stageId === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW ||
			submission.stageId === pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW
		) {
			return `workflow_${submission.stageId}_${
				getCurrentReviewRound(submission, submission.stageId)?.id
			}`;
		} else if (
			submission.stageId === pkp.const.WORKFLOW_STAGE_ID_PRODUCTION &&
			submission.status !== pkp.const.STATUS_QUEUED
		) {
			return `publication_titleAbstract`;
		} else {
			return `workflow_${submission.stageId}`;
		}
	}

	return {getMenuItems, getInitialSelectionItemKey};
}

import {useSubmission} from '@/composables/useSubmission';
import {useLocalize} from '@/composables/useLocalize';
import {DashboardPageTypes} from '@/pages/dashboard/dashboardPageStore';
const {getCurrentReviewRound, getLatestPublication} = useSubmission();

const {t} = useLocalize();

const StageColors = {
	[pkp.const.WORKFLOW_STAGE_ID_SUBMISSION]: 'border-stage-desk-review',
	[pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW]:
		'border-stage-in-internal-review',
	[pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW]: 'border-stage-in-review',
	[pkp.const.WORKFLOW_STAGE_ID_EDITING]: 'border-stage-copyediting',
	[pkp.const.WORKFLOW_STAGE_ID_PRODUCTION]: 'border-stage-production',
};

export function getPublicationItem({publicationId, label, name}) {
	return {
		key: `publication_${publicationId}_${name}`,
		label: label,
		state: {
			publicationId,
			primaryMenuItem: 'publication',
			secondaryMenuItem: name,
			title: getPublicationTitle(label),
		},
	};
}

export function getWorkflowItem({stageId, label, isActive, items}) {
	return {
		key: `workflow_${stageId}`,
		label: label,
		colorStripe: isActive ? StageColors[stageId] : null,
		state: {
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

export function getReviewItems({submission, stageId}) {
	const {getActiveStage, getCurrentReviewRound} = useSubmission();

	const activeStage = getActiveStage(submission);

	const activeReviewRound = getCurrentReviewRound(submission, stageId);

	const reviewMenuItems = [];

	const {getReviewRoundsForStage} = useSubmission();
	const reviewRounds = getReviewRoundsForStage(submission, stageId);

	const TitleKeys = {
		[pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW]:
			'submission.stage.externalReviewWithRound',
		[pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW]:
			'submission.stage.internalReviewWithRound',
	};

	reviewRounds.forEach((reviewRound) => {
		reviewMenuItems.push(
			getReviewItem({
				stageId,
				reviewRound,
				isActive:
					activeStage.id === stageId && activeReviewRound.id === reviewRound.id,
				title: getWorkflowTitle(
					t(TitleKeys[stageId], {round: reviewRound.round}),
				),
			}),
		);
	});

	return reviewMenuItems;
}

export function getReviewItem({stageId, reviewRound, isActive, title}) {
	return {
		key: `workflow_${stageId}_${reviewRound.id}`,
		label: t('workflow.reviewRoundN', {number: reviewRound.round}),
		colorStripe: isActive ? StageColors[stageId] : null,
		state: {
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
			title: t('manager.publication.reviewStage'),
		});

		const items = [];

		items.push(
			getWorkflowItem({
				stageId: pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
				label: t('manager.publication.submissionStage'),
				isActive: activeStage.id === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
			}),
		);

		items.push(
			getWorkflowItem({
				stageId: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
				label: t('manager.publication.reviewStage'),
				isActive:
					activeStage.id === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
				items: externalReviewItems,
			}),
		);

		items.push(
			getWorkflowItem({
				stageId: pkp.const.WORKFLOW_STAGE_ID_EDITING,
				label: t('submission.copyediting'),
				isActive: activeStage.id === pkp.const.WORKFLOW_STAGE_ID_EDITING,
			}),
		);

		items.push(
			getWorkflowItem({
				stageId: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
				label: t('manager.publication.productionStage'),
				isActive: activeStage.id === pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
			}),
		);

		return items;
	}

	function getPublicationItemsAuthor({publication, permissions}) {
		if (!publication?.id) {
			return [];
		}

		const items = [];
		const {id: publicationId} = publication;

		items.push(
			getPublicationItem({
				publicationId,
				name: 'titleAbstract',
				label: t('publication.titleAbstract'),
			}),
		);

		items.push(
			getPublicationItem({
				publicationId,
				name: 'contributors',
				label: t('publication.contributors'),
			}),
		);

		items.push(
			getPublicationItem({
				publicationId,
				name: 'metadata',
				label: t('article.metadata'),
			}),
		);

		if (publicationSettings.supportsCitations) {
			items.push(
				getPublicationItem({
					publicationId,
					name: 'citations',
					label: t('submission.citations'),
				}),
			);
		}

		items.push(
			getPublicationItem({
				publicationId,
				name: 'galleys',
				label: t('submission.layout.galleys'),
			}),
		);

		return items;
	}

	function getPublicationVersionItems({submission, permissions}) {
		if (!submission?.publications?.length) {
			return [];
		}

		const {publications} = submission;
		const items = [];

		publications.forEach((publication) => {
			if (
				pageInitConfig.dashboardPage ===
					DashboardPageTypes.EDITORIAL_DASHBOARD &&
				permissions.canAccessPublication
			) {
				items.push({
					key: `publication_${publication.id}`,
					label: publication.versionString,
					items: getPublicationItemsEditorial({publication, permissions}),
				});
			} else if (
				pageInitConfig.dashboardPage === DashboardPageTypes.MY_SUBMISSIONS
			) {
				items.push({
					key: `publication_${publication.id}`,
					label: publication.versionString,
					items: getPublicationItemsAuthor({publication, permissions}),
				});
			}
		});

		if (permissions.canPublish) {
			items.push({
				key: 'publication_create_new_version',
				label: t('publication.createVersion'),
				action: 'createNewVersion',
			});
		}

		return items;
	}

	function getPublicationItemsEditorial({publication, permissions}) {
		if (!publication?.id) {
			return [];
		}

		const items = [];
		const {id: publicationId} = publication;

		items.push(
			getPublicationItem({
				publicationId,
				name: 'titleAbstract',
				label: t('publication.titleAbstract'),
			}),
		);

		items.push(
			getPublicationItem({
				publicationId,
				name: 'contributors',
				label: t('publication.contributors'),
			}),
		);

		items.push(
			getPublicationItem({
				publicationId,
				name: 'metadata',
				label: t('article.metadata'),
			}),
		);

		if (publicationSettings.supportsCitations) {
			items.push(
				getPublicationItem({
					publicationId,
					name: 'citations',
					label: t('submission.citations'),
				}),
			);
		}

		if (publicationSettings.identifiersEnabled) {
			items.push(
				getPublicationItem({
					publicationId,
					name: 'identifiers',
					label: t('submission.identifiers'),
				}),
			);
		}

		items.push(
			getPublicationItem({
				publicationId,
				name: 'jats',
				label: t('publication.jats'),
			}),
		);

		if (permissions.canAccessProduction) {
			items.push(
				getPublicationItem({
					publicationId,
					name: 'galleys',
					label: t('submission.layout.galleys'),
				}),
			);

			items.push(
				getPublicationItem({
					publicationId,
					name: 'license',
					label: t('publication.publicationLicense'),
				}),
			);

			items.push(
				getPublicationItem({
					publicationId,
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

		let menuItems = [];

		menuItems.push({
			key: 'workflow',
			label: t('manager.workflow'),
			icon: 'Dashboard',
			items: getWorkflowItems({submission, permissions}),
		});

		if (
			[
				DashboardPageTypes.EDITORIAL_DASHBOARD,
				DashboardPageTypes.MY_SUBMISSIONS,
			].includes(pageInitConfig.dashboardPage)
		) {
			menuItems.push({
				key: 'publication',
				label: t('submission.publication'),
				icon: 'MySubmissions',
				items: getPublicationVersionItems({submission, permissions}),
			});
		}

		return menuItems;
	}

	function getInitialSelectionItemKey({submission}) {
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
			const latestPublication = getLatestPublication(submission);
			return `publication_${latestPublication.id}_titleAbstract`;
		} else {
			return `workflow_${submission.stageId}`;
		}
	}

	return {getMenuItems, getInitialSelectionItemKey};
}

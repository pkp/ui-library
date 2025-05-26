import {useSubmission} from '@/composables/useSubmission';
import {useLocalize} from '@/composables/useLocalize';
import {DashboardPageTypes} from '@/pages/dashboard/dashboardPageStore';
import {
	getPublicationItem,
	getWorkflowItem,
	getReviewItems,
} from './useWorkflowNavigationConfigOJS';

const {getCurrentReviewRound, getLatestPublication} = useSubmission();

const {t} = useLocalize();

export function getMarketingTitle(marketingMenuTitle) {
	return `${t('semicolon', {
		label: t('settings.libraryFiles.category.marketing'),
	})} ${marketingMenuTitle}`;
}

function getMarketingItem({label, name}) {
	return {
		key: `marketing_${name}`,
		label: label,
		state: {
			primaryMenuItem: 'marketing',
			secondaryMenuItem: name,
			title: getMarketingTitle(label),
		},
	};
}

export function useWorkflowNavigationConfigOMP(pageInitConfig) {
	const {publicationSettings} = pageInitConfig;
	const {t} = useLocalize();

	function getWorkflowItems({submission}) {
		const {getActiveStage} = useSubmission();

		const activeStage = getActiveStage(submission);

		const internalReviewItems = getReviewItems({
			submission,
			stageId: pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW,
		});

		const externalReviewItems = getReviewItems({
			submission,
			stageId: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
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
				stageId: pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW,
				label: t('workflow.review.internalReview'),
				isActive:
					activeStage.id === pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW,
				isDisabled: internalReviewItems.length,
				items: internalReviewItems,
			}),
		);

		items.push(
			getWorkflowItem({
				stageId: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
				label: t('workflow.review.externalReview'),
				isActive:
					activeStage.id === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
				isDisabled: externalReviewItems.length,
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
				name: 'chapters',
				label: t('submission.chapters'),
			}),
		);

		items.push(
			getPublicationItem({
				publicationId,
				name: 'metadata',
				label: t('submission.metadata'),
			}),
		);

		items.push(
			getPublicationItem({
				publicationId,
				name: 'publicationFormats',
				label: t('submission.publicationFormats'),
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
				name: 'chapters',
				label: t('submission.chapters'),
			}),
		);

		items.push(
			getPublicationItem({
				publicationId,
				name: 'metadata',
				label: t('submission.metadata'),
			}),
		);

		items.push(
			getPublicationItem({
				publicationId,
				name: 'publicationFormats',
				label: t('submission.publicationFormats'),
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

		if (permissions.canAccessProduction) {
			items.push(
				getPublicationItem({
					publicationId,
					name: 'catalogEntry',
					label: t('publication.catalogEntry'),
				}),
			);

			items.push(
				getPublicationItem({
					publicationId,
					name: 'license',
					label: t('publication.publicationLicense'),
				}),
			);
		}

		return items;
	}

	function getMarketingItems({submission, permissions}) {
		const menuItems = [];

		menuItems.push(
			getMarketingItem({
				name: 'audience',
				label: t('monograph.audience'),
			}),
		);

		menuItems.push(
			getMarketingItem({
				name: 'representatives',
				label: t('grid.catalogEntry.representatives'),
			}),
		);

		menuItems.push(
			getMarketingItem({
				name: 'publicationDates',
				label: t('grid.catalogEntry.publicationDates'),
			}),
		);

		return menuItems;
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

	function getMenuItems({submission, permissions}) {
		if (!submission) {
			return [];
		}
		const menuItems = [];

		menuItems.push({
			key: 'workflow',
			label: t('manager.workflow'),
			icon: 'Dashboard',
			items: getWorkflowItems({submission, permissions}),
		});

		if (
			pageInitConfig.dashboardPage === DashboardPageTypes.EDITORIAL_DASHBOARD
		) {
			menuItems.push({
				key: 'marketing',
				label: t('settings.libraryFiles.category.marketing'),
				icon: 'Dashboard',
				items: getMarketingItems({submission, permissions}),
			});
		}
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

import {useSubmission} from '@/composables/useSubmission';
import {useLocalize} from '@/composables/useLocalize';
import {DashboardPageTypes} from '@/pages/dashboard/dashboardPageStore';
import {
	getPublicationItem,
	getWorkflowItem,
} from './useWorkflowNavigationConfigOJS';

const {getActiveStage, getLatestPublication} = useSubmission();

const {t} = useLocalize();

export function getWorkflowTitle(stageLabel) {
	return `${t('semicolon', {label: t('manager.workflow')})} ${stageLabel} `;
}

export function getPublicationTitle(publicationMenuTitle) {
	return `${t('semicolon', {
		label: t('submission.publication'),
	})} ${publicationMenuTitle}`;
}

export function useWorkflowNavigationConfigOPS(pageInitConfig) {
	const {publicationSettings} = pageInitConfig;
	const {t} = useLocalize();

	function getWorkflowItems({submission}) {
		const activeStage = getActiveStage(submission);

		const items = [];

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
				label: t('submission.informationCenter.metadata'),
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

		items.push(
			getPublicationItem({
				publicationId,
				name: 'discussions',
				label: t('submission.queries.production'),
			}),
		);

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
				label: t('submission.informationCenter.metadata'),
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
					name: 'preprintEntry',
					label: t('preprint.entry'),
				}),
			);
		}

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

	function getMenuItems({submission, permissions}) {
		if (!submission) {
			return [];
		}

		const menuItems = [];

		if (
			pageInitConfig.dashboardPage === DashboardPageTypes.EDITORIAL_DASHBOARD
		) {
			menuItems.push({
				key: 'workflow',
				label: t('manager.workflow'),
				icon: 'Dashboard',
				items: getWorkflowItems({submission, permissions}),
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
		const latestPublication = getLatestPublication(submission);

		// Author seeing only publication items
		if (pageInitConfig.dashboardPage === DashboardPageTypes.MY_SUBMISSIONS) {
			return `publication_${latestPublication.id}_titleAbstract`;
		}

		if (
			submission.stageId === pkp.const.WORKFLOW_STAGE_ID_PRODUCTION &&
			submission.status !== pkp.const.STATUS_QUEUED
		) {
			return `publication_${latestPublication.id}_titleAbstract`;
		} else {
			return `workflow_${submission.stageId}`;
		}
	}

	return {getMenuItems, getInitialSelectionItemKey};
}

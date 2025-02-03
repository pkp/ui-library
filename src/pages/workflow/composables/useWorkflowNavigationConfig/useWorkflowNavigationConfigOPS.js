import {useSubmission} from '@/composables/useSubmission';
import {useLocalize} from '@/composables/useLocalize';
import {DashboardPageTypes} from '@/pages/dashboard/dashboardPageStore';
import {
	getPublicationItem,
	getWorkflowItem,
} from './useWorkflowNavigationConfigOJS';

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
		const {getActiveStage} = useSubmission();

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
				label: t('submission.informationCenter.metadata'),
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

		items.push(
			getPublicationItem({
				name: 'galleys',
				label: t('submission.layout.galleys'),
			}),
		);

		items.push(
			getPublicationItem({
				name: 'discussions',
				label: t('submission.queries.production'),
			}),
		);

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
				label: t('submission.informationCenter.metadata'),
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
					name: 'preprintEntry',
					label: t('preprint.entry'),
				}),
			);
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
			pageInitConfig.dashboardPage === DashboardPageTypes.EDITORIAL_DASHBOARD &&
			permissions.canAccessPublication
		) {
			menuItems.push({
				key: 'publication',
				label: t('submission.publication'),
				icon: 'MySubmissions',
				items: getPublicationItemsEditorial({submission, permissions}),
			});
		} else if (
			pageInitConfig.dashboardPage === DashboardPageTypes.MY_SUBMISSIONS
		) {
			menuItems.push({
				key: 'publication',
				label: t('submission.publication'),
				icon: 'MySubmissions',
				items: getPublicationItemsAuthor({submission, permissions}),
			});
		}

		return menuItems;
	}

	function getInitialSelectionItemKey(submission) {
		if (
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

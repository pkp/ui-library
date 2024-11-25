import {useLocalize} from '@/composables/useLocalize';
import {DashboardPageTypes} from '@/pages/dashboard/dashboardPageStore';

import * as ConfigAuthorOJS from './workflowConfigAuthorOJS';
import * as ConfigEditorialOJS from './workflowConfigEditorialOJS';

import * as ConfigAuthorOMP from './workflowConfigAuthorOMP';
import * as ConfigEditorialOMP from './workflowConfigEditorialOMP';

export function useWorkflowConfigOMP({dashboardPage}) {
	const {t} = useLocalize();

	let Configs = null;

	if (dashboardPage === DashboardPageTypes.EDITORIAL_DASHBOARD) {
		Configs = {
			getHeaderItems: ConfigEditorialOMP.getHeaderItems,
			WorkflowConfig: {
				...ConfigEditorialOJS.WorkflowConfig,
				...ConfigEditorialOMP.WorkflowConfig,
			},
			PublicationConfig: {
				...ConfigEditorialOJS.PublicationConfig,
				...ConfigEditorialOMP.PublicationConfig,
			},
			MarketingConfig: ConfigEditorialOMP.MarketingConfig,
		};
	} else {
		Configs = {
			getHeaderItems: ConfigEditorialOMP.getHeaderItems,
			WorkflowConfig: {
				...ConfigAuthorOJS.WorkflowConfig,
				...ConfigAuthorOMP.WorkflowConfig,
			},
			PublicationConfig: {
				...ConfigAuthorOJS.PublicationConfig,
				...ConfigAuthorOMP.PublicationConfig,
			},
		};
	}

	function _getItems(
		getterFnName,
		{
			selectedMenuState,
			submission,
			pageInitConfig,
			selectedPublication,
			selectedPublicationId,
			selectedReviewRound,
			permissions,
		},
	) {
		if (selectedMenuState.stageId) {
			const itemsArgs = {
				submission,
				selectedPublication,
				selectedPublicationId,
				selectedStageId: selectedMenuState.stageId,
				selectedReviewRound,
				permissions,
			};
			if (!submission) {
				return [];
			}

			if (!permissions.accessibleStages.includes(selectedMenuState.stageId)) {
				if (getterFnName === 'getPrimaryItems') {
					return [
						{
							component: 'PrimaryBasicMetadata',
							props: {body: t('user.authorization.accessibleWorkflowStage')},
						},
					];
				} else {
					return [];
				}
			}

			const commonItems =
				Configs.WorkflowConfig?.common?.[getterFnName]?.(itemsArgs);

			// early return, if common logic decides there is nothing more to show
			if (commonItems?.shouldContinue === false) {
				return commonItems?.items || [];
			}

			return [
				...(commonItems?.items || []),
				...(Configs.WorkflowConfig[selectedMenuState.stageId]?.[getterFnName]?.(
					itemsArgs,
				) || []),
			];
		} else if (selectedMenuState.primaryMenuItem === 'publication') {
			const itemsArgs = {
				submission,
				pageInitConfig: pageInitConfig,
				selectedPublication,
				selectedPublicationId,
				permissions,
			};
			if (!submission || !selectedPublication) {
				return [];
			}

			const commonItems =
				Configs.PublicationConfig?.common?.[getterFnName]?.(itemsArgs);

			if (commonItems?.shouldContinue === false) {
				return commonItems?.items || [];
			}
			return [
				...(commonItems?.items || []),
				...(Configs.PublicationConfig[selectedMenuState.secondaryMenuItem]?.[
					getterFnName
				]?.(itemsArgs) || []),
			];
		} else if (selectedMenuState.primaryMenuItem === 'marketing') {
			const itemsArgs = {
				submission,
				pageInitConfig: pageInitConfig,
				permissions,
			};

			if (!submission) {
				return [];
			}

			const commonItems =
				Configs.MarketingConfig?.common?.[getterFnName]?.(itemsArgs);

			if (commonItems?.shouldContinue === false) {
				return commonItems?.items || [];
			}

			return [
				...(commonItems?.items || []),
				...(Configs.MarketingConfig[selectedMenuState.secondaryMenuItem]?.[
					getterFnName
				]?.(itemsArgs) || []),
			];
		}
	}

	function getHeaderItems(args) {
		return Configs.getHeaderItems(args);
	}

	function getPrimaryItems(args) {
		return _getItems('getPrimaryItems', args);
	}

	function getSecondaryItems(args) {
		return _getItems('getSecondaryItems', args);
	}

	function getActionItems(args) {
		return _getItems('getActionItems', args);
	}

	function getPublicationControlsLeft(args) {
		return _getItems('getPublicationControlsLeft', args);
	}

	function getPublicationControlsRight(args) {
		return _getItems('getPublicationControlsRight', args);
	}

	return {
		getHeaderItems,
		getPrimaryItems,
		getSecondaryItems,
		getActionItems,
		getPublicationControlsLeft,
		getPublicationControlsRight,
	};
}

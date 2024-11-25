import {DashboardPageTypes} from '@/pages/dashboard/dashboardPageStore';

import * as ConfigAuthorShared from './workflowConfigAuthorOJS';
import * as ConfigEditorialShared from './workflowConfigEditorialOJS';

import * as ConfigAuthorOJS from './workflowConfigAuthorOJS';
import * as ConfigEditorialOJS from './workflowConfigEditorialOJS';

export function useWorkflowConfigOJS({dashboardPage}) {
	let Configs = null;

	if (dashboardPage === DashboardPageTypes.EDITORIAL_DASHBOARD) {
		Configs = {
			getHeaderItems: ConfigEditorialOJS.getHeaderItems,
			WorkflowConfig: {
				...ConfigEditorialShared.WorkflowConfig,
				...ConfigEditorialOJS.WorkflowConfig,
			},
			PublicationConfig: {
				...ConfigEditorialShared.PublicationConfig,
				...ConfigEditorialOJS.PublicationConfig,
			},
		};
	} else {
		Configs = {
			getHeaderItems: ConfigEditorialOJS.getHeaderItems,
			WorkflowConfig: {
				...ConfigAuthorShared.WorkflowConfig,
				...ConfigAuthorOJS.WorkflowConfig,
			},
			PublicationConfig: {
				...ConfigAuthorShared.PublicationConfig,
				...ConfigAuthorOJS.PublicationConfig,
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

import {DashboardPageTypes} from '@/pages/dashboard/dashboardPageStore';

import * as ConfigAuthorOJS from './workflowConfigAuthorOJS';
import * as ConfigEditorialOJS from './workflowConfigEditorialOJS';
import {consolidateCommonAndSpecificItems} from './workflowConfigHelpers';

export function useWorkflowConfigOJS({dashboardPage}) {
	let Configs = null;

	if (dashboardPage === DashboardPageTypes.EDITORIAL_DASHBOARD) {
		Configs = ConfigEditorialOJS;
	} else {
		Configs = ConfigAuthorOJS;
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
				pageInitConfig,
			};
			if (!submission) {
				return [];
			}

			return consolidateCommonAndSpecificItems(
				Configs.WorkflowConfig,
				// workflow config is using stageId as keys
				selectedMenuState.stageId,
				getterFnName,
				itemsArgs,
			);
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

			return consolidateCommonAndSpecificItems(
				Configs.PublicationConfig,
				// publication config is using menu name as keys
				selectedMenuState.secondaryMenuItem,
				getterFnName,
				itemsArgs,
			);
		}

		return [];
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

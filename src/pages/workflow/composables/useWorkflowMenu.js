import {useSideMenu} from '@/composables/useSideMenu';
import {computed, watch} from 'vue';
import {useQueryParams} from '@/composables/useQueryParams';

export function useWorkflowMenu({
	menuItems,
	submission,
	workflowNavigationConfig,
}) {
	const {
		sideMenuProps,
		setExpandedKeys,
		setActiveItemKey,
		selectedItem: selectedMenuItem,
	} = useSideMenu(menuItems);

	/**
	 * Url query params
	 */
	// Reactive query params parsed from the url
	const queryParamsUrl = useQueryParams();

	/**
	 * primaryMenuItem: workflow/publication/marketing
	 * secondaryMenuItem: name of publication/marketing submenu
	 * stageId: applicable when primaryMenuItem is workflow
	 * reviewRoundId: applicable when reviewRound is selected
	 */
	const selectedMenuState = computed(() => {
		const actionArgs = selectedMenuItem.value?.actionArgs || {};

		return {
			...actionArgs,
		};
	});

	const selectedMenuKey = computed(() => {
		return selectedMenuItem.value?.key || null;
	});

	const menuTitle = computed(() => {
		return selectedMenuState.value?.title || '';
	});

	function navigateToMenu(key) {
		return setActiveItemKey(key);
	}

	watch(submission, (newSubmission, oldSubmission) => {
		// Once the submission is fetched, select relevant stage in navigation
		if (!oldSubmission && newSubmission) {
			// use the menu selection from the url, if it does exist, otherwise fallback
			if (queryParamsUrl?.workflowMenuKey?.length) {
				const doesKeyExist = navigateToMenu(queryParamsUrl?.workflowMenuKey);
				if (doesKeyExist) {
					return;
				}
			}
			navigateToMenu(
				workflowNavigationConfig.getInitialSelectionItemKey(newSubmission),
			);
		}
	});

	// Update selectedMenuKey in url when menu selection changes
	watch(selectedMenuKey, (newSelectedMenuKey) => {
		queryParamsUrl.workflowMenuKey = newSelectedMenuKey;
	});

	return {
		menuTitle,
		navigateToMenu,
		selectedMenuKey,
		selectedMenuState,
		setExpandedKeys,
		sideMenuProps,
	};
}

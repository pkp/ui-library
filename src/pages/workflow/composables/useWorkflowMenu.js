import {useSideMenu} from '@/composables/useSideMenu';
import {computed, watch} from 'vue';
import {useQueryParams} from '@/composables/useQueryParams';
import {useSubmission} from '@/composables/useSubmission';

export function useWorkflowMenu({
	menuItems,
	submission,
	workflowNavigationConfig,
	dashboardPage,
	handleCreateNewVersion = () => {},
}) {
	const {
		sideMenuProps,
		setExpandedKeys,
		setActiveItemKey,
		selectedItem: selectedMenuItem,
		expandedKeys,
		updateExpandedKeys,
	} = useSideMenu(menuItems, {onActionFn: handleCreateNewVersion});

	const {getLatestPublication} = useSubmission();

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
	 * publicationId: applicable when primaryMenuItem is publication
	 */
	const selectedMenuState = computed(() => {
		const state = selectedMenuItem.value?.state;
		return {
			...state,
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
			// Update expandedKeys for publication menu
			const latestPublication = getLatestPublication(newSubmission);
			if (latestPublication?.id) {
				updateExpandedKeys({
					...expandedKeys.value,
					[`publication_${latestPublication.id}`]: true,
				});
			}

			// use the menu selection from the url, if it does exist, otherwise fallback
			if (queryParamsUrl?.workflowMenuKey?.length) {
				const doesKeyExist = navigateToMenu(queryParamsUrl?.workflowMenuKey);
				if (doesKeyExist) {
					return;
				}
			}
			navigateToMenu(
				workflowNavigationConfig.getInitialSelectionItemKey({
					submission: newSubmission,
					dashboardPage,
				}),
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

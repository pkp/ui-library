import {useSideMenu} from '@/composables/useSideMenu';
import {computed} from 'vue';
import {useSubmission} from '@/composables/useSubmission';

const {getReviewRound} = useSubmission();

export function useWorkflowMenu({menuItems, submission}) {
	const {
		sideMenuProps,
		setExpandedKeys,
		setActiveItemKey,
		selectedItem: selectedMenuItem,
	} = useSideMenu(menuItems);

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

	const menuTitle = computed(() => {
		return selectedMenuState.value?.title || '';
	});

	const selectedReviewRound = computed(() => {
		if (!selectedMenuState.value.reviewRoundId) {
			return null;
		}
		const reviewRound = getReviewRound(
			submission.value,
			selectedMenuState.value.reviewRoundId,
		);
		return reviewRound;
	});

	function navigateToMenu(key) {
		setActiveItemKey(key);
	}

	return {
		menuTitle,
		navigateToMenu,
		selectedMenuState,
		selectedReviewRound,
		setExpandedKeys,
		sideMenuProps,
	};
}

import {useLocalize} from '@/composables/useLocalize';
const Actions = {
	RESPONSE_VIEW: 'responseView',
	RESPONSE_DELETE: 'responseDelete',
	RESPONSE_EDIT: 'responseEdit',
};
export function useReviewRoundAuthorResponseConfig() {
	const {t} = useLocalize();

	function getColumns({reviewRound}) {
		const columns = [
			{
				header: t('user.role.author'),
				headerSrOnly: false,
				component: 'AuthorResponseRequestManagerCellAuthor',
				props: {},
			},
			{
				header: t('editor.submission.reviewRound.responseStatus'),
				headerSrOnly: false,
				component: 'AuthorResponseRequestManagerCellStatus',
				props: {},
			},
		];

		// If a response was submitted then include column with actions.
		// There are no applicable actions if no response has been submitted yet.
		if (reviewRound.value.authorResponse) {
			columns.push({
				header: t('grid.columns.actions'),
				component: 'AuthorResponseRequestManagerCellMoreActions',
				props: {},
				headerSrOnly: true,
			});
		}

		return columns;
	}

	/**
	 * Get the actions available on the row for the assigned author that submitted the review response.
	 *
	 * A publication can have multiple assigned authors, but only a single review response can be submitted.
	 * A submitted response will include the list of authors(contributors) on whose behalf the response was submitted.
	 * Therefore, for each assigned author listed only include actions for the one who submitted the response. The authors
	 * who the response was submitted on behalf of can be seen when the `view` action is clicked.
	 */
	function getAuthorItemActions({author: authorUser, reviewRound}) {
		const actions = [];

		const response = reviewRound.authorResponse;

		// No response has been submitted, therefore no action can be perform on the listed authors.
		if (!response) {
			return actions;
		}

		const submittingUser = response.submittedByUser;

		actions.push(
			{
				label: t('common.view'),
				icon: 'View',
				name: Actions.RESPONSE_VIEW,
				disabled: submittingUser.id !== authorUser.id,
			},
			{
				label: t('common.delete'),
				icon: 'Cancel',
				name: Actions.RESPONSE_DELETE,
				isWarnable: true,
				disabled: submittingUser.id !== authorUser.id,
			},
		);

		return actions;
	}

	/**
	 * Get the actions avaialble at the top of the table.
	 */
	function getTopItems() {
		return [
			{
				component: 'AuthorResponseRequestManagerActionButton',
				props: {
					label: t('editor.submission.reviewRound.RequestResponse'),
					action: 'navigateToRequestAuthorReviewResponsePage',
				},
			},
		];
	}
	return {
		getColumns,
		getTopItems,
		getAuthorItemActions,
	};
}

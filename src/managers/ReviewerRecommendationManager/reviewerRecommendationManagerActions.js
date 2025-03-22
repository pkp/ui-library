export function useReviewerRecommendationManagerActions(apiUrl) {
	async function toggleStatus({id, newStatus}) {
		try {
			await $.ajax({
				url: `${apiUrl}/${id}/status`,
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'PUT',
				},
				data: {
					status: Number(newStatus),
				},
			});
			return true;
		} catch (error) {
			return false;
		}
	}

	async function deleteRecommendation({id}) {
		try {
			await $.ajax({
				url: `${apiUrl}/${id}`,
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'DELETE',
				},
			});
			return true;
		} catch (error) {
			return false;
		}
	}

	return {
		toggleStatus,
		deleteRecommendation,
	};
}

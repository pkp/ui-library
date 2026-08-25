import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useNotify} from '@/composables/useNotify';

const exports = {
	authorPdf: {op: 'export-pdf', authorFriendly: 1},
	authorXml: {op: 'export-xml', authorFriendly: 1},
	editorPdf: {op: 'export-pdf', authorFriendly: 0},
	editorXml: {op: 'export-xml', authorFriendly: 0},
};

/** The review the reviewer submitted: their comments or review form responses, and its downloads. */
export function useReviewContent({submission, reviewAssignment}) {
	const {notify} = useNotify();

	const {apiUrl: reviewContentApiUrl} = useUrl(
		`submissions/${encodeURIComponent(submission.id)}/reviewAssignments/${reviewAssignment.id}/review`,
	);

	// Null until loaded; a review the reviewer has not submitted still comes back, just empty
	const {
		fetch: loadReviewContent,
		data: reviewContent,
		isLoading: isLoadingReviewContent,
	} = useFetch(reviewContentApiUrl);

	async function saveReviewContent(body) {
		const {
			fetch: sendReviewContent,
			data: savedReviewContent,
			validationError,
			isSuccess,
		} = useFetch(reviewContentApiUrl, {
			method: 'PUT',
			body,
			expectValidationError: true,
		});
		await sendReviewContent();

		return {
			data: savedReviewContent.value,
			validationError: validationError.value,
			isSuccess: isSuccess.value,
		};
	}

	async function downloadReview(name) {
		const {op, authorFriendly} = exports[name];
		const {apiUrl: reviewExportApiUrl} = useUrl(
			`reviews/${submission.id}/${reviewAssignment.id}/${op}?authorFriendly=${authorFriendly}`,
		);

		const {
			fetch: requestReviewExport,
			data: reviewExport,
			isSuccess,
			validationError,
		} = useFetch(reviewExportApiUrl, {
			method: 'GET',
			expectValidationError: true,
		});
		await requestReviewExport();

		if (validationError.value) {
			notify(validationError.value.error, 'warning');
			return;
		}

		if (isSuccess.value) {
			const {apiUrl: reviewExportFileApiUrl} = useUrl(
				`reviews/${submission.id}/exports/${reviewExport.value.temporaryFileId}`,
			);

			const anchor = document.createElement('a');
			anchor.href = reviewExportFileApiUrl.value;
			document.body.appendChild(anchor);
			anchor.click();
			document.body.removeChild(anchor);
		}
	}

	return {
		reviewContent,
		isLoadingReviewContent,
		loadReviewContent,
		saveReviewContent,
		downloadReview,
	};
}

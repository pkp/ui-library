import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {useLocalize} from '@/composables/useLocalize';

/**
 * Upload files as dependent files of another submission file, for example
 * the figure images that belong to a body-text document.
 *
 * The composable does not report failures itself: it never opens the
 * network-error dialog and never throws. `uploadFile` resolves to
 * `{id, url}` on success or `{error}` with a human-readable message, and
 * each caller decides how to show that.
 *
 * @param {Object} options
 * @param {number} options.submissionId
 * @param {() => Promise<number|null|undefined>} options.getAssocId Resolves
 *   the id of the submission file the upload is attached to. Called for
 *   every upload so the caller can create that file lazily.
 */
export function useDependentFileUpload({submissionId, getAssocId}) {
	const {t} = useLocalize();
	const {apiUrl} = useUrl(`submissions/${submissionId}/files`);

	async function uploadFile(file) {
		const assocId = await getAssocId();
		if (!assocId) {
			return {error: t('common.uploadFailed')};
		}

		const formData = new FormData();
		formData.append('fileStage', String(pkp.const.SUBMISSION_FILE_DEPENDENT));
		formData.append('assocId', assocId);
		formData.append('assocType', pkp.const.ASSOC_TYPE_SUBMISSION_FILE);
		formData.append('file', file);

		let error = null;
		const {data, fetch} = useFetch(apiUrl, {
			method: 'POST',
			body: formData,
			onError: (e) => {
				error =
					e?.data?.errorMessage ||
					e?.data?.error ||
					e?.message ||
					t('common.unknownError');
				return true;
			},
		});
		await fetch();

		if (!data.value?.id) {
			return {error: error || t('common.uploadFailed')};
		}
		return {id: data.value.id, url: data.value.url};
	}

	return {uploadFile};
}

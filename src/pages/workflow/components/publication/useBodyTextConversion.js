import {ref} from 'vue';
import {preparePDFHTML} from './WorkflowPublicationBodyTextPDF.js';
import {bodyTextMathStyles} from '@/components/BodyTextEditor/useBodyTextEditor.js';
import {useFetch} from '@/composables/useFetch';
import {useModal} from '@/composables/useModal';
import {useUrl} from '@/composables/useUrl';
import {useLocalize} from '@/composables/useLocalize';

/** Convert the live editor document without saving or replacing its JSON. */
export function useBodyTextConversion({
	submissionId,
	publicationId,
	getHTML,
	onGalleySaved,
}) {
	const {t} = useLocalize();
	const {openDialog} = useModal();
	const {apiUrl: bodyTextApiUrl} = useUrl(
		`submissions/${submissionId}/publications/${publicationId}/bodyText`,
	);
	const isPreviewing = ref(false);
	const previewHTML = ref('');
	const isExporting = ref(false);
	const exportStatus = ref('');

	function showExportError(error) {
		openDialog({
			title: t('common.error'),
			message: error?.message || t('common.error'),
			actions: [{label: t('common.ok'), callback: (close) => close()}],
			modalStyle: 'negative',
		});
	}

	async function previewPDF() {
		if (isExporting.value) return;
		isExporting.value = true;
		try {
			previewHTML.value = await getHTML();
			isPreviewing.value = true;
		} catch (error) {
			showExportError(error);
		} finally {
			isExporting.value = false;
		}
	}

	async function saveGalley(body, suffix = '') {
		let requestError;
		const {data, isSuccess, fetch} = useFetch(
			`${bodyTextApiUrl.value}${suffix}`,
			{
				method: 'POST',
				body,
				headers: {'Content-Type': body.type},
				onError: (error) => {
					requestError = error;
					return true;
				},
			},
		);
		await fetch();
		if (!isSuccess.value || !data.value) {
			throw new Error(
				requestError?.data?.error || requestError?.message || t('common.error'),
			);
		}
		await onGalleySaved();
	}

	function savePDF(pdf) {
		return saveGalley(pdf, '/pdf');
	}

	async function exportHTML() {
		if (isExporting.value) return;
		isExporting.value = true;
		exportStatus.value = '';
		try {
			const html = preparePDFHTML(await getHTML(), document.baseURI);
			await saveGalley(
				new Blob(
					[
						`<!doctype html><html><head><meta charset="utf-8"><style>${bodyTextMathStyles}</style></head><body>${html}</body></html>`,
					],
					{type: 'text/html'},
				),
			);
			exportStatus.value = t('publication.bodyText.exportedToHTML');
		} catch (error) {
			showExportError(error);
		} finally {
			isExporting.value = false;
		}
	}

	return {
		isPreviewing,
		previewHTML,
		isExporting,
		exportStatus,
		previewPDF,
		savePDF,
		exportHTML,
	};
}

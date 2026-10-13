<template>
	<iframe
		ref="previewRef"
		class="body-text-pdf-preview"
		:title="t('publication.bodyText.pdf.preview')"
		:srcdoc="previewDocument"
		@load="bindPreviewButtons"
	></iframe>
</template>

<script setup>
import {computed, onBeforeUnmount, ref} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {
	createPDFPreviewDocument,
	generatePDF,
} from './WorkflowPublicationBodyTextPDF.js';

const props = defineProps({
	html: {type: String, required: true},
	savePdf: {type: Function, required: true},
});
const {t} = useLocalize();
const emit = defineEmits(['edit']);
const previewRef = ref(null);
let pdfUrl = null;
let isGenerating = false;
let isDisposed = false;

const previewDocument = computed(() =>
	createPDFPreviewDocument(props.html, {
		baseUrl: document.baseURI,
		title: t('publication.bodyText.pdf.preview'),
		publicationLabel: t('publication.bodyText.pdf.publication'),
		previewLabel: `${t('common.preview')}: PDF`,
		editLabel: t('common.edit'),
		generateLabel: t('publication.bodyText.pdf.generate'),
	}),
);

function bindPreviewButtons() {
	const backButton =
		previewRef.value?.contentDocument?.getElementById('back-to-editor');
	if (backButton) backButton.onclick = () => emit('edit');
	const button =
		previewRef.value?.contentDocument?.getElementById('generate-pdf');
	if (button) button.onclick = generatePreview;
}

async function generatePreview() {
	if (isGenerating) return;
	const frameDocument = previewRef.value?.contentDocument;
	const button = frameDocument?.getElementById('generate-pdf');
	const status = frameDocument?.getElementById('pdf-status');
	if (!button || !status) return;
	isGenerating = true;
	button.disabled = true;
	status.textContent = t('publication.bodyText.pdf.generating');

	try {
		const bytes = await generatePDF(props.html, {
			baseUrl: document.baseURI,
			assetBaseUrl: new URL('js/build/vivliostyle-pdf/', `${pkp.site.baseUrl}/`)
				.href,
		});
		if (isDisposed) return;
		const pdf = new Blob([bytes], {type: 'application/pdf'});
		status.textContent = t('publication.bodyText.pdf.saving');
		await props.savePdf(pdf);
		if (isDisposed) return;
		const previousUrl = pdfUrl;
		pdfUrl = URL.createObjectURL(pdf);
		const viewer = frameDocument.getElementById('pdf-viewer');
		viewer.src = pdfUrl;
		viewer.hidden = false;
		frameDocument.getElementById('html-preview').hidden = true;
		if (previousUrl) URL.revokeObjectURL(previousUrl);
		status.textContent = t('publication.bodyText.pdf.galleyCreated');
	} catch (error) {
		console.error('PDF preview generation failed', error);
		status.textContent = t('publication.bodyText.pdf.failed');
	} finally {
		isGenerating = false;
		button.disabled = false;
	}
}

onBeforeUnmount(() => {
	isDisposed = true;
	if (pdfUrl) URL.revokeObjectURL(pdfUrl);
});
</script>

<style scoped>
.body-text-pdf-preview {
	display: block;
	width: 100%;
	flex: 1;
	min-width: 0;
	min-height: 600px;
	border: 1px solid #bfc3c5;
	background: #f8f9fa;
}
</style>

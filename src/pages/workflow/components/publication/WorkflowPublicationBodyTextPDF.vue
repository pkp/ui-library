<template>
	<section
		class="body-text-pdf-preview flex min-w-0 flex-1 flex-col bg-secondary"
	>
		<header
			class="flex flex-none items-center gap-2 border-b border-light bg-secondary px-4 py-4"
		>
			<Button
				is-link
				icon="ChevronLeft"
				:aria-label="t('common.edit')"
				:title="t('common.edit')"
				@click="emit('edit')"
			/>
			<h2 class="text-xl-normal uppercase text-heading">
				<strong>{{ t('publication.bodyText.pdf.publication') }}</strong>
				{{ t('common.preview') }}: PDF
			</h2>
		</header>
		<iframe
			v-if="pdfUrl"
			key="pdf"
			class="block min-h-[60vh] w-full flex-1 border-0"
			:title="t('publication.bodyText.pdf.preview')"
			:src="pdfUrl"
		></iframe>
		<iframe
			v-else
			key="html"
			class="block min-h-[60vh] w-full flex-1 border-0"
			:title="t('publication.bodyText.pdf.preview')"
			:srcdoc="previewDocument"
		></iframe>
		<footer
			class="sticky bottom-0 z-10 flex flex-none flex-wrap items-center justify-end gap-4 border-t border-light bg-secondary px-4 py-2 sm:px-6"
		>
			<span class="me-auto text-base-normal" role="status" aria-live="polite">
				{{ status }}
			</span>
			<Button is-primary :is-disabled="isGenerating" @click="generatePreview">
				{{ t('publication.bodyText.pdf.generate') }}
			</Button>
		</footer>
	</section>
</template>

<script setup>
import {computed, onBeforeUnmount, ref} from 'vue';
import Button from '@/components/Button/Button.vue';
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
const pdfUrl = ref(null);
const status = ref('');
const isGenerating = ref(false);
let isDisposed = false;

const previewDocument = computed(() =>
	createPDFPreviewDocument(props.html, {
		baseUrl: document.baseURI,
		title: t('publication.bodyText.pdf.preview'),
	}),
);

async function generatePreview() {
	if (isGenerating.value) return;
	isGenerating.value = true;
	status.value = t('publication.bodyText.pdf.generating');

	try {
		const bytes = await generatePDF(props.html, {
			baseUrl: document.baseURI,
			assetBaseUrl: new URL('js/build/vivliostyle-pdf/', `${pkp.site.baseUrl}/`)
				.href,
		});
		if (isDisposed) return;
		const pdf = new Blob([bytes], {type: 'application/pdf'});
		status.value = t('publication.bodyText.pdf.saving');
		await props.savePdf(pdf);
		if (isDisposed) return;
		const previousUrl = pdfUrl.value;
		pdfUrl.value = URL.createObjectURL(pdf);
		if (previousUrl) URL.revokeObjectURL(previousUrl);
		status.value = t('publication.bodyText.pdf.galleyCreated');
	} catch (error) {
		console.error('PDF preview generation failed', error);
		if (!isDisposed) status.value = t('publication.bodyText.pdf.failed');
	} finally {
		isGenerating.value = false;
	}
}

onBeforeUnmount(() => {
	isDisposed = true;
	if (pdfUrl.value) URL.revokeObjectURL(pdfUrl.value);
});
</script>

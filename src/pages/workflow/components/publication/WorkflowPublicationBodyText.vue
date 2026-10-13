<template>
	<div v-show="!isPreviewing">
		<BodyTextEditor
			ref="editorRef"
			:submission-id="props.submission.id"
			:publication-id="props.publication.id"
			:citations="props.publication.citations"
			:import-file="importFile"
			@import-finished="clearImportParams"
		>
			<template #document-actions="{canConvert}">
				<DropdownActions
					ref="exportDropdownRef"
					class="body-text-export"
					direction="right"
					:label="t('common.export')"
					:actions="[
						{
							name: 'exportHTML',
							label: t('publication.bodyText.exportToHTML'),
							disabled: !canConvert || isExporting,
							actionFn: exportHTML,
						},
						{
							name: 'previewPDF',
							label: `${t('common.preview')}: PDF`,
							disabled: !canConvert || isExporting,
							actionFn: openPDFPreview,
						},
					]"
				/>
				<p v-if="exportStatus" role="status" aria-live="polite">
					{{ exportStatus }}
				</p>
			</template>
		</BodyTextEditor>
	</div>
	<WorkflowPublicationBodyTextPDF
		v-if="isPreviewing"
		:html="previewHTML"
		:save-pdf="savePDF"
		@edit="closePDFPreview"
	/>
</template>

<script setup>
/**
 * Workflow-side wrapper around the body-text editor: wires it to the
 * workflow store's navigation guard and to the auto-import request the
 * File Manager's "Send to Text Editor" action puts into the URL.
 */
import {ref, computed, nextTick, onMounted, onBeforeUnmount} from 'vue';
import BodyTextEditor from '@/components/BodyTextEditor/BodyTextEditor.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import WorkflowPublicationBodyTextPDF from './WorkflowPublicationBodyTextPDF.vue';
import {useBodyTextConversion} from './useBodyTextConversion.js';
import {useQueryParams} from '@/composables/useQueryParams';
import {useLocalize} from '@/composables/useLocalize';
import {useWorkflowStore} from '@/pages/workflow/workflowStore';

const props = defineProps({
	submission: {type: Object, required: true},
	publication: {type: Object, required: true},
});

const {t} = useLocalize();
const workflowStore = useWorkflowStore();
const editorRef = ref(null);
const exportDropdownRef = ref(null);
const {
	isPreviewing,
	previewHTML,
	isExporting,
	exportStatus,
	previewPDF,
	savePDF,
	exportHTML,
} = useBodyTextConversion({
	submissionId: props.submission.id,
	publicationId: props.publication.id,
	getHTML: () => editorRef.value.getHTML(),
	onGalleySaved: () => workflowStore.triggerDataChange(),
});

async function openPDFPreview() {
	// Release the fullscreen focus trap before displaying a separate preview.
	editorRef.value.exitFullscreen();
	await previewPDF();
}

async function closePDFPreview() {
	isPreviewing.value = false;
	await nextTick();
	exportDropdownRef.value?.$el?.querySelector('button')?.focus();
}

/**
 * ?importFileUrl=...&importFileName=... asks the editor to import that file
 * once its own document is loaded; the parameters are cleared when it is
 * done so a reload does not import again.
 */
const queryParams = useQueryParams();
const importFile = computed(() =>
	queryParams.importFileUrl && queryParams.importFileName
		? {url: queryParams.importFileUrl, fileName: queryParams.importFileName}
		: null,
);

function clearImportParams() {
	queryParams.importFileUrl = null;
	queryParams.importFileName = null;
}

const navigationGuard = (item) => {
	if (!editorRef.value?.isDirty) return true;
	const currentKey = workflowStore.sideMenuProps?.activeItemKey;
	if (item?.key && item.key === currentKey) return true;
	return window.confirm(t('form.dataHasChanged'));
};

onMounted(() => {
	if (typeof workflowStore.setNavigationGuard === 'function') {
		workflowStore.setNavigationGuard(navigationGuard);
	}
});

onBeforeUnmount(() => {
	if (typeof workflowStore.setNavigationGuard === 'function') {
		workflowStore.setNavigationGuard(null);
	}
});
</script>

<style scoped>
.body-text-export :deep([aria-haspopup='menu']) {
	@apply text-lg-semibold text-primary;
	padding-block: 0.4375rem;
}

.body-text-export :deep([role='menu']) {
	margin-top: 0.25rem;
}
</style>

<template>
	<BodyTextEditor
		ref="editorRef"
		:submission-id="props.submission.id"
		:publication-id="props.publication.id"
		:citations="props.publication.citations"
		:import-file="importFile"
		@import-finished="clearImportParams"
	/>
</template>

<script setup>
/**
 * Workflow-side wrapper around the body-text editor: wires it to the
 * workflow store's navigation guard and to the auto-import request the
 * File Manager's "Send to Text Editor" action puts into the URL.
 */
import {ref, computed, onMounted, onBeforeUnmount} from 'vue';
import BodyTextEditor from '@/components/BodyTextEditor/BodyTextEditor.vue';
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

<template>
	<div
		class="flex flex-col gap-4"
		:class="{'sciflow-fullscreen': isFullscreen}"
	>
		<div class="workflow-body flex gap-4">
			<div class="editor-pane">
				<div class="formatbar-wrapper">
					<sciflow-formatbar for="sciflow-editor"></sciflow-formatbar>
				</div>
				<sciflow-editor id="sciflow-editor" ref="editorRef"></sciflow-editor>
			</div>
			<div
				class="sidebar-pane"
				:class="{'sidebar-pane--collapsed': isSidebarCollapsed}"
			>
				<div class="sidebar-sticky">
					<div
						class="sidebar-actions"
						:class="{'sidebar-actions--collapsed': isSidebarCollapsed}"
					>
						<PkpButton
							class="sidebar-toggle"
							size-variant="compact"
							:icon="isSidebarCollapsed ? 'ChevronLeft' : 'ChevronRight'"
							@click="toggleSidebar"
						>
							<span class="sr-only">
								{{ isSidebarCollapsed ? 'Show panel' : 'Hide panel' }}
							</span>
						</PkpButton>
						<span v-if="isDirty" class="unsaved-indicator">
							Unsaved changes
						</span>
						<div
							class="sidebar-action-buttons"
							:class="{'sidebar-action-buttons--collapsed': isSidebarCollapsed}"
						>
							<PkpButton
								:class="{'save-button--dirty': isDirty}"
								@click="saveDocument"
							>
								Save
							</PkpButton>
							<PkpButton @click="toggleFullscreen">
								{{ isFullscreen ? 'Exit Fullscreen' : 'Fullscreen' }}
							</PkpButton>
						</div>
					</div>
					<div v-show="!isSidebarCollapsed" class="sidebar-content">
						<div class="sidebar-tabs">
							<button
								class="sidebar-tab"
								:class="{
									'sidebar-tab--active': activeSidebarTab === 'document',
								}"
								type="button"
								@click="activeSidebarTab = 'document'"
							>
								Document
							</button>
							<button
								v-if="isSelectionEditable"
								class="sidebar-tab"
								:class="{'sidebar-tab--active': activeSidebarTab === 'edit'}"
								type="button"
								@click="activeSidebarTab = 'edit'"
							>
								Edit
							</button>
						</div>
						<div
							v-show="activeSidebarTab === 'edit'"
							class="sidebar-tab-panel sidebar-tab-panel--scroll"
						>
							<h2 class="text-lg-bold">Selected Element</h2>
							<sciflow-selection-editor
								for="sciflow-editor"
							></sciflow-selection-editor>
						</div>
						<div
							v-show="activeSidebarTab === 'document'"
							class="sidebar-tab-panel"
						>
							<h2 class="text-lg-bold">Outline</h2>
							<sciflow-outline
								for="sciflow-editor"
								levels="1-3"
							></sciflow-outline>
							<h2 class="mt-4 text-lg-bold">References</h2>
							<sciflow-reference-list
								id="sciflow-references"
								ref="referenceListRef"
							></sciflow-reference-list>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
/** --------------------------------
 * Imports
 * --------------------------------- */
import {ref, watch, onMounted, onBeforeUnmount} from 'vue';
import {
	citationFeature,
	listFeature,
	blockquoteFeature,
	copyPasteFeature,
	headingFeature,
	tableFeature,
	createFigureFeature,
	SourceField,
	setSciFlowThemeStyles,
} from '@sciflow/editor-start/dist/bundle/sciflow-editor.js';
import PkpButton from '@/components/Button/Button.vue';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useWorkflowStore} from '@/pages/workflow/workflowStore';
import {useLocalize} from '@/composables/useLocalize';

/** --------------------------------
 * Props / Store Context
 * --------------------------------- */
const props = defineProps({
	submission: {type: Object, required: true},
	publication: {type: Object, required: true},
});

const workflowStore = useWorkflowStore();
const {t} = useLocalize();

/** --------------------------------
 * Reactive State
 * --------------------------------- */
/** Template refs */
const editorRef = ref(null);
const referenceListRef = ref(null);

/** Track if editor is mounted and configured */
const isEditorReady = ref(false);

/** Current document state from editor */
const currentDocument = ref(null);

/** Track saved document state to detect unsaved changes */
const savedDocumentSerialized = ref('');
const isDirty = ref(false);
const activeSidebarTab = ref('document');
const isSelectionEditable = ref(false);

/**
 * Prevents accidental data loss when navigating away from this workflow tab.
 * Integrates with workflow-level navigation guards when that API is available.
 *
 * @param {{key?: string}|undefined} item Target menu item from workflow navigation.
 * @returns {boolean} True to allow navigation, false to block.
 */
const navigationGuard = (item) => {
	if (!isDirty.value) {
		return true;
	}

	const currentKey = workflowStore.sideMenuProps?.activeItemKey;
	if (item?.key && item.key === currentKey) {
		return true;
	}

	return window.confirm(t('form.dataHasChanged'));
};

/** Fullscreen state for editor layout */
const isFullscreen = ref(false);

/** Collapsible sidebar state */
const isSidebarCollapsed = ref(false);

/** --------------------------------
 * API Endpoints / Data Sources
 * --------------------------------- */
/** API URL for body text endpoint */
const {apiUrl: bodyTextApiUrl} = useUrl(
	`submissions/${props.submission.id}/publications/${props.publication.id}/bodyText`,
);

/** API URL for submission files (used for figure uploads) */
const {apiUrl: filesApiUrl} = useUrl(
	`submissions/${props.submission.id}/files`,
);

/** Fetch body text data immediately */
const {data: bodyTextData, fetch: fetchBodyText} = useFetch(bodyTextApiUrl);
fetchBodyText();

/** --------------------------------
 * Editor Configuration
 * --------------------------------- */
/** Editor features configuration */
const editorFeatures = [
	citationFeature,
	headingFeature,
	listFeature,
	blockquoteFeature,
	copyPasteFeature,
	tableFeature,
	createFigureFeature({imageUpload: {uploadFile: handleFigureUpload}}),
];

/** ProseMirror overrides injected into the editor's shadow DOM (avoids bleeding into OJS) */
const PROSEMIRROR_SHADOW_STYLES = `
	.ProseMirror { line-height: 1.5; }
	.ProseMirror h1, .ProseMirror h2, .ProseMirror h3, .ProseMirror h4, .ProseMirror h5, .ProseMirror h6 {
		position: relative;
		margin: 0 0 0.35em 0;
		padding: 0;
		line-height: 1.2;
	}
	.ProseMirror h1::before, .ProseMirror h2::before, .ProseMirror h3::before {
		top: 0;
		transform: translateY(0);
	}
	.ProseMirror p { margin: 0 0 0.75em 0; }
	.ProseMirror table p { margin: 0; }
`;

/** Global theme applied across all SciFlow components */
const SCIFLOW_THEME_STYLES = `
:host {
	--sciflow-accent: #2563eb;
	--sciflow-surface: #ffffff;
}
`;

/** --------------------------------
 * Lifecycle
 * --------------------------------- */
onMounted(async () => {
	if (typeof workflowStore.setNavigationGuard === 'function') {
		workflowStore.setNavigationGuard(navigationGuard);
	}

	const editor = editorRef.value;
	if (!editor) {
		return;
	}

	setSciFlowThemeStyles(SCIFLOW_THEME_STYLES);
	editor.setShadowStyles([PROSEMIRROR_SHADOW_STYLES]);
	await editor.configureFeatures(editorFeatures);
	editor.addEventListener('editor-change', handleEditorChange);
	editor.addEventListener('editor-selection-change', handleSelectionChange);

	if (referenceListRef.value) {
		referenceListRef.value.references = transformCitationsForEditor(
			props.publication.citations,
		);
	}

	isEditorReady.value = true;
});

onBeforeUnmount(() => {
	if (typeof workflowStore.setNavigationGuard === 'function') {
		workflowStore.setNavigationGuard(null);
	}
});

/** --------------------------------
 * UI Actions
 * --------------------------------- */
function toggleFullscreen() {
	isFullscreen.value = !isFullscreen.value;
}

function toggleSidebar() {
	isSidebarCollapsed.value = !isSidebarCollapsed.value;
}

/** --------------------------------
 * Watchers
 * --------------------------------- */
// Initialize editor when both editor is ready and data is loaded
watch(
	[isEditorReady, bodyTextData],
	([editorReady, data]) => {
		if (!editorReady || !data) {
			return;
		}

		const documentContent =
			typeof data.bodyTextContent === 'string'
				? JSON.parse(data.bodyTextContent)
				: data.bodyTextContent;

		const dependentFiles = (data.dependentFiles || []).map((f) => ({
			id: f.id,
			url: f.url,
			mimeType: f.mimetype,
		}));

		const references = transformCitationsForEditor(props.publication.citations);
		validateExternalResources(documentContent, dependentFiles, references);
		editorRef.value.doc = {
			doc: documentContent,
			files: dependentFiles,
			references,
		};
		currentDocument.value = documentContent;
		savedDocumentSerialized.value = serializeDocument(documentContent);
		isDirty.value = false;
	},
	{immediate: true},
);

watch(isSelectionEditable, (editable) => {
	if (!editable && activeSidebarTab.value === 'edit') {
		activeSidebarTab.value = 'document';
	}
});

/** --------------------------------
 * Editor Event Handlers
 * --------------------------------- */
function handleEditorChange(event) {
	const updatedDoc = event.detail?.doc ?? null;
	currentDocument.value = updatedDoc;
	isDirty.value =
		serializeDocument(updatedDoc) !== savedDocumentSerialized.value;
}

function handleSelectionChange(event) {
	const selection = event.detail;
	const hasSelection = Boolean(
		selection &&
			(typeof selection.anchor === 'number' ||
				typeof selection.from === 'number'),
	);
	const isEditable = selection?.editable ?? selection?.isEditable ?? true;
	isSelectionEditable.value = hasSelection && isEditable;

	if (!referenceListRef.value) {
		return;
	}

	const doc = editorRef.value?.document;

	if (!doc || !selection) {
		referenceListRef.value.highlight([]);
		return;
	}

	const referencedIds = extractReferencedIds(doc, selection);
	referenceListRef.value.highlight(referencedIds);
}

/** --------------------------------
 * Selection / Document Helpers
 * --------------------------------- */
/**
 * Collects citation IDs in the current selection.
 * Supports both newer editor document API (`editor.document`) and
 * older/fallback access via `editorView.state.doc`.
 *
 * @param {import('prosemirror-model').Node|null} doc ProseMirror document instance.
 * @param {{anchor?: number, head?: number, from?: number, to?: number}|null} selection Selection payload from `editor-selection-change`.
 * @returns {string[]} Referenced citation IDs for highlight syncing.
 */
function extractReferencedIds(doc, selection) {
	if (!doc || typeof doc.nodesBetween !== 'function') {
		const view = editorRef.value?.editorView;
		if (view?.state?.doc && selection) {
			const from = Math.min(
				selection.anchor ?? selection.from ?? 0,
				selection.head ?? selection.to ?? 0,
			);
			const to = Math.max(
				selection.anchor ?? selection.from ?? 0,
				selection.head ?? selection.to ?? 0,
			);
			const citations = [];
			view.state.doc.nodesBetween(from, Math.max(to, from + 1), (node) => {
				if (node.type.name !== 'citation') {
					return;
				}
				const sourceEntries = SourceField.fromString(
					node.attrs?.source ?? null,
				);
				citations.push({source: sourceEntries});
			});
			return citations.flatMap((c) =>
				(c.source || [])
					.map((entry) =>
						typeof entry?.id === 'string' ? entry.id.trim() : entry?.id,
					)
					.filter(Boolean),
			);
		}
		return [];
	}

	const docSize = doc.content?.size ?? doc.nodeSize ?? 0;
	const from = Math.min(
		selection.anchor ?? selection.from ?? 0,
		selection.head ?? selection.to ?? 0,
	);
	const to = Math.max(
		selection.anchor ?? selection.from ?? 0,
		selection.head ?? selection.to ?? 0,
	);

	if (docSize <= 0 || from < 0 || to > docSize) {
		return [];
	}

	const citations = [];
	doc.nodesBetween(from, Math.max(to, from + 1), (node) => {
		if (node.type.name !== 'citation') {
			return;
		}
		const sourceEntries = SourceField.fromString(node.attrs?.source ?? null);
		citations.push({source: sourceEntries});
	});

	return citations.flatMap((citation) =>
		(citation.source || [])
			.map((entry) =>
				typeof entry?.id === 'string' ? entry.id.trim() : entry?.id,
			)
			.filter(Boolean),
	);
}

/**
 * Best-effort integrity check for document payload hydration.
 * Logs missing figure file references and citation references to help debugging
 * inconsistent editor state after loading persisted content.
 *
 * @param {Record<string, any>|null} doc Editor document JSON.
 * @param {Array<{id: string|number, url?: string}>} files Dependent submission files.
 * @param {Array<{id: string|number}>} references Publication citation references.
 */
function validateExternalResources(doc, files, references) {
	if (!doc || typeof doc !== 'object') {
		return;
	}

	const fileIds = new Set((files || []).map((file) => String(file.id)));
	const fileUrls = new Set(
		(files || []).map((file) => file.url).filter(Boolean),
	);
	const referenceIds = new Set((references || []).map((ref) => String(ref.id)));

	const missingFileSources = new Set();
	const missingReferenceIds = new Set();

	const visit = (node) => {
		if (!node || typeof node !== 'object') {
			return;
		}

		if (node.type === 'figure') {
			const src =
				typeof node?.attrs?.src === 'string' ? node.attrs.src.trim() : '';
			if (src && !fileIds.has(src) && !fileUrls.has(src)) {
				missingFileSources.add(src);
			}
		}

		if (node.type === 'citation') {
			const sourceEntries = SourceField.fromString(node.attrs?.source ?? null);
			sourceEntries.forEach((entry) => {
				if (entry?.id && !referenceIds.has(String(entry.id))) {
					missingReferenceIds.add(String(entry.id));
				}
			});
		}

		if (Array.isArray(node.content)) {
			node.content.forEach(visit);
		}
	};

	visit(doc);

	if (missingFileSources.size > 0) {
		console.warn('[sciflow] Missing figure resources for sources:', [
			...missingFileSources,
		]);
	}
	if (missingReferenceIds.size > 0) {
		console.warn('[sciflow] Missing reference entries for ids:', [
			...missingReferenceIds,
		]);
	}
}

/** --------------------------------
 * Persistence Actions
 * --------------------------------- */
/**
 * Persists the current editor document to the bodyText endpoint.
 * Also updates local dirty tracking when save succeeds.
 */
async function saveDocument() {
	if (!currentDocument.value) {
		return;
	}

	const formData = new FormData();
	formData.append('bodyText', JSON.stringify(currentDocument.value));

	const {data, fetch} = useFetch(bodyTextApiUrl, {
		method: 'PUT',
		body: formData,
	});

	await fetch();

	if (data.value) {
		bodyTextData.value = data.value;
		savedDocumentSerialized.value = serializeDocument(currentDocument.value);
		isDirty.value = false;
	}
}

async function handleFigureUpload(file) {
	// Auto-save document first if no body text file exists yet
	if (!bodyTextData.value?.id) {
		await saveDocument();
	}

	if (!bodyTextData.value?.id) {
		throw new Error('Failed to save document before uploading figure');
	}

	const formData = new FormData();
	formData.append('fileStage', String(pkp.const.SUBMISSION_FILE_DEPENDENT));
	formData.append('assocId', bodyTextData.value.id);
	formData.append('assocType', pkp.const.ASSOC_TYPE_SUBMISSION_FILE);
	formData.append('file', file);

	const {data: uploadedFile, fetch} = useFetch(filesApiUrl, {
		method: 'POST',
		body: formData,
	});

	await fetch();

	return {
		id: uploadedFile.value.id,
		url: uploadedFile.value.url,
	};
}

/** --------------------------------
 * Utility Helpers
 * --------------------------------- */
function transformCitationsForEditor(citations) {
	return (citations || []).map((citation) => ({
		...citation,
		id: String(citation.id),
	}));
}

/**
 * Serializes document JSON for cheap dirty-state comparison.
 * Returns empty string on invalid/unserializable payloads.
 *
 * @param {Record<string, any>|null} doc Editor document JSON.
 * @returns {string}
 */
function serializeDocument(doc) {
	if (!doc || typeof doc !== 'object') {
		return '';
	}

	try {
		return JSON.stringify(doc);
	} catch (error) {
		return '';
	}
}
</script>

<style scoped>
.formatbar-wrapper {
	position: sticky;
	top: 0;
	z-index: 5;
	background: #f8fafc;
	padding: 0.35rem 0;
}

.workflow-body {
	position: relative;
}

.editor-pane {
	flex: 1;
	min-width: 0;
}

.sidebar-pane {
	width: 28%;
	min-width: 14rem;
	max-width: 22rem;
	transition:
		width 0.2s ease,
		min-width 0.2s ease,
		opacity 0.2s ease;
}

.sidebar-pane--collapsed {
	width: max-content;
	min-width: 0;
	opacity: 1;
}

.sidebar-actions {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.5rem;
}

.sidebar-actions--collapsed {
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
}

.sidebar-action-buttons {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-end;
	gap: 0.5rem;
}

.sidebar-action-buttons--collapsed {
	flex-direction: column;
	align-items: stretch;
	justify-content: flex-start;
	width: 100%;
}

.sidebar-sticky {
	position: sticky;
	top: 0;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	height: calc(100vh - 2rem);
	overflow: hidden;
}

.sidebar-tabs {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	border-bottom: 1px solid #e2e8f0;
	padding-bottom: 0.5rem;
}

.sidebar-tab {
	background: transparent;
	border: 0;
	padding: 0.25rem 0;
	font-weight: 600;
	color: #475569;
	cursor: pointer;
}

.sidebar-tab--active {
	color: #1d4ed8;
	box-shadow: inset 0 -2px 0 #1d4ed8;
}

.sidebar-tab-panel {
	padding-top: 0.75rem;
}

.sidebar-tab-panel--scroll {
	flex: 1;
	min-height: 0;
	overflow-y: auto;
}

.sidebar-content {
	display: flex;
	flex-direction: column;
	flex: 1;
	min-height: 0;
	overflow: hidden;
	padding-right: 0.25rem;
}

.sciflow-fullscreen {
	position: fixed;
	inset: 0;
	background: #ffffff;
	padding: 1rem;
	z-index: 1000;
	overflow: auto;
}

.save-button--dirty {
	background: #fef3c7;
	border-color: #f59e0b;
	box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.35);
	color: #92400e;
}

.unsaved-indicator {
	color: #92400e;
	font-size: 0.875rem;
	font-weight: 600;
	white-space: nowrap;
}
</style>

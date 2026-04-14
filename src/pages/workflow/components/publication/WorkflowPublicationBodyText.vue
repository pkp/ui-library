<template>
	<div
		ref="mainContainerRef"
		class="sciflow-body-text"
		:class="{
			'sciflow-body-text--fullscreen': isFullscreen,
		}"
	>
		<div class="sciflow-body-text__main">
			<h2 id="sciflow-editor-heading" class="sr-only">
				Publication body text editor
			</h2>
			<section
				class="sciflow-body-text__editor-section"
				aria-labelledby="sciflow-editor-heading"
			>
				<div class="sciflow-body-text__editor-area">
					<div class="sciflow-body-text__editor-toolbar">
						<sciflow-formatbar
							class="sciflow-body-text__formatbar"
							for="sciflow-editor"
						></sciflow-formatbar>
					</div>
					<div class="sciflow-body-text__editor-scroll">
						<sciflow-editor
							id="sciflow-editor"
							ref="editorRef"
						></sciflow-editor>
					</div>
				</div>
			</section>
		</div>

		<aside class="sciflow-body-text__sidebar" aria-label="Document panel">
			<div class="sciflow-body-text__sidebar-panel">
				<div class="sciflow-body-text__document-bar">
					<h2 class="sciflow-body-text__panel-title">Document Edit</h2>
					<div class="sciflow-body-text__document-actions">
						<span v-show="isDirty" class="sciflow-body-text__unsaved">
							Unsaved changes
						</span>
						<div
							id="sciflow-fullscreen-status"
							class="sr-only"
							aria-live="polite"
							aria-atomic="true"
						></div>
						<div class="sciflow-body-text__document-buttons">
							<PkpButton
								ref="fullscreenBtnRef"
								:aria-pressed="isFullscreen"
								@click="toggleFullscreen"
							>
								{{ isFullscreen ? 'Exit fullscreen' : 'Fullscreen' }}
							</PkpButton>
							<PkpButton :is-primary="isDirty" @click="saveDocument">
								{{ saveButtonLabel }}
							</PkpButton>
						</div>
					</div>
				</div>

				<details
					v-for="section in sidebarSections"
					:key="section.key"
					class="sciflow-body-text__sidebar-section"
					:data-sidebar-section="section.key"
					:open="openAccordionSection === section.key"
					@toggle="handleAccordionToggle(section.key, $event)"
				>
					<summary class="sciflow-body-text__sidebar-summary">
						<Icon
							v-if="section.icon"
							:icon="section.icon"
							class="sciflow-body-text__sidebar-icon"
							aria-hidden="true"
						/>
						<h3 :id="section.headingId">{{ section.title }}</h3>
					</summary>
					<div class="sciflow-body-text__sidebar-body">
						<!-- References section -->
						<template v-if="section.key === 'references'">
							<p class="sciflow-body-text__sidebar-description">
								Drag references into the editor to place an in-text citation.
							</p>
							<sciflow-reference-list
								id="sciflow-references"
								:references="editorReferences"
							></sciflow-reference-list>
						</template>

						<!-- Selected Element section -->
						<template v-else-if="section.key === 'selected-element'">
							<sciflow-selection-editor
								for="sciflow-editor"
							></sciflow-selection-editor>
						</template>

						<!-- Outline section -->
						<template v-else-if="section.key === 'outline'">
							<sciflow-outline
								for="sciflow-editor"
								levels="1-3"
							></sciflow-outline>
						</template>
					</div>
				</details>
			</div>
		</aside>
	</div>
</template>

<script setup>
/** --------------------------------
 * Imports
 * --------------------------------- */
import {ref, watch, onMounted, onBeforeUnmount} from 'vue';
import * as sciFlowEditor from '@sciflow/editor-start/bundle';
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useWorkflowStore} from '@/pages/workflow/workflowStore';
import {useLocalize} from '@/composables/useLocalize';
import {
	loadMathJax,
	getCitedReferenceIds,
	validateDocumentResources,
	transformCitationsForEditor,
	serializeDocument,
} from './WorkflowPublicationBodyTextUtils.js';

const {
	citationFeature,
	listFeature,
	blockquoteFeature,
	copyPasteFeature,
	headingFeature,
	tableFeature,
	createFigureFeature,
	markFormattingFeature,
	setSciFlowThemeStyles,
} = sciFlowEditor;
const crossReferenceFeature = Reflect.get(
	sciFlowEditor,
	'crossReferenceFeature',
);
const mathFeature = Reflect.get(sciFlowEditor, 'mathFeature');

const ALL_OPTIONAL_FEATURES = [
	citationFeature,
	crossReferenceFeature,
	markFormattingFeature,
	headingFeature,
	listFeature,
	blockquoteFeature,
	copyPasteFeature,
	tableFeature,
	mathFeature,
].filter(Boolean);

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
const editorRef = ref(null);
const mainContainerRef = ref(null);
const fullscreenBtnRef = ref(null);

const isEditorReady = ref(false);
const editorReferences = ref([]);
const currentDocument = ref(null);
const savedDocumentSerialized = ref('');
const isDirty = ref(false);
const saveButtonLabel = ref('Save');

/** Accordion: which section is open (only one at a time) */
const openAccordionSection = ref('references');

/** Sidebar sections */
const sidebarSections = [
	{
		key: 'references',
		title: 'References',
		headingId: 'sciflow-references-heading',
		icon: 'EditorMenuBook',
	},
	{
		key: 'selected-element',
		title: 'Selected Element',
		headingId: 'sciflow-selected-heading',
		icon: 'EditorTune',
	},
	{
		key: 'outline',
		title: 'Document Outline',
		headingId: 'sciflow-outline-heading',
		icon: 'EditorToc',
	},
];

const navigationGuard = (item) => {
	if (!isDirty.value) return true;
	const currentKey = workflowStore.sideMenuProps?.activeItemKey;
	if (item?.key && item.key === currentKey) return true;
	return window.confirm(t('form.dataHasChanged'));
};

const isFullscreen = ref(false);

/** --------------------------------
 * API Endpoints / Data Sources
 * --------------------------------- */
const {apiUrl: bodyTextApiUrl} = useUrl(
	`submissions/${props.submission.id}/publications/${props.publication.id}/bodyText`,
);
const {apiUrl: filesApiUrl} = useUrl(
	`submissions/${props.submission.id}/files`,
);
const {data: bodyTextData, fetch: fetchBodyText} = useFetch(bodyTextApiUrl);
fetchBodyText();

/** --------------------------------
 * Editor Configuration
 * --------------------------------- */
const ALWAYS_ON_FEATURES = [
	createFigureFeature({imageUpload: {uploadFile: handleFigureUpload}}),
];

const getSelectedFeatures = () => [
	...ALWAYS_ON_FEATURES,
	...ALL_OPTIONAL_FEATURES,
];

async function applyFeatureConfiguration() {
	const editor = editorRef.value;
	if (!editor) return;
	const activeFeatures = getSelectedFeatures();
	await (typeof editor.configureFeatures === 'function'
		? editor.configureFeatures(activeFeatures)
		: Promise.resolve((editor.features = activeFeatures)));
	syncReferenceListHighlight();
}

const PROSEMIRROR_SHADOW_STYLES = `
	.ProseMirror { line-height: 1.5; }
	.ProseMirror h1, .ProseMirror h2, .ProseMirror h3, .ProseMirror h4, .ProseMirror h5, .ProseMirror h6 {
		position: relative;
		margin: 0 0 0.35em 0;
		padding: 0;
		line-height: 1.2;
	}
	.ProseMirror p { margin: 0 0 0.75em 0; }
	.ProseMirror table p { margin: 0; }
`;

const SCIFLOW_THEME_STYLES = `
:host {
	--sciflow-accent: #2563eb;
	--sciflow-surface: #ffffff;
}
`;

/** --------------------------------
 * Dynamic height – fill remaining viewport space
 * --------------------------------- */
const BOTTOM_MARGIN = 32;
const MIN_HEIGHT = 400;

function fitContainerHeight() {
	const el = mainContainerRef.value;
	if (!el || isFullscreen.value) return;
	const top = el.getBoundingClientRect().top;
	const available = window.innerHeight - top - BOTTOM_MARGIN;
	el.style.height = `${Math.max(MIN_HEIGHT, Math.round(available))}px`;
}

let resizeObserver = null;

/** --------------------------------
 * Lifecycle
 * --------------------------------- */
onMounted(async () => {
	if (typeof workflowStore.setNavigationGuard === 'function') {
		workflowStore.setNavigationGuard(navigationGuard);
	}

	const editor = editorRef.value;
	if (!editor) return;

	await loadMathJax().catch((err) =>
		console.warn(
			'[sciflow] MathJax 4 failed to load — equations will not render',
			err,
		),
	);

	setSciFlowThemeStyles(SCIFLOW_THEME_STYLES);
	editor.setShadowStyles([PROSEMIRROR_SHADOW_STYLES]);
	await applyFeatureConfiguration();
	editor.addEventListener('editor-change', handleEditorChange);
	editor.addEventListener('editor-selection-change', handleSelectionChange);

	editorReferences.value = transformCitationsForEditor(
		props.publication?.citations ?? [],
	);

	isEditorReady.value = true;

	fitContainerHeight();
	window.addEventListener('resize', fitContainerHeight);

	const scrollParent = mainContainerRef.value?.closest(
		'.pkp-modal-scroll-container',
	);
	if (scrollParent) {
		resizeObserver = new ResizeObserver(fitContainerHeight);
		resizeObserver.observe(scrollParent);
	}

	document.addEventListener('fullscreenchange', updateFullscreenState);
	document.addEventListener('webkitfullscreenchange', updateFullscreenState);
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', fitContainerHeight);
	resizeObserver?.disconnect();
	resizeObserver = null;
	document.removeEventListener('fullscreenchange', updateFullscreenState);
	document.removeEventListener('webkitfullscreenchange', updateFullscreenState);
	if (typeof workflowStore.setNavigationGuard === 'function') {
		workflowStore.setNavigationGuard(null);
	}
});

/** --------------------------------
 * UI Actions
 * --------------------------------- */
function updateFullscreenState() {
	const entering =
		document.fullscreenElement === mainContainerRef.value ||
		document.webkitFullscreenElement === mainContainerRef.value;
	const exiting = isFullscreen.value && !entering;
	isFullscreen.value = entering;

	const statusEl = document.getElementById('sciflow-fullscreen-status');
	if (statusEl) {
		statusEl.textContent = entering
			? 'Entered fullscreen mode'
			: 'Exited fullscreen mode';
	}

	if (exiting) {
		fullscreenBtnRef.value?.$el?.focus();
	}
}

function toggleFullscreen() {
	if (!mainContainerRef.value) return;
	if (document.fullscreenElement === mainContainerRef.value) {
		document.exitFullscreen();
	} else {
		mainContainerRef.value.requestFullscreen?.() ??
			mainContainerRef.value.webkitRequestFullscreen?.();
	}
	updateFullscreenState();
}

function handleAccordionToggle(sectionKey, event) {
	const details = event.target;
	if (details?.open) {
		openAccordionSection.value = sectionKey;
	} else {
		openAccordionSection.value = null;
	}
}

/** --------------------------------
 * Watchers
 * --------------------------------- */
watch(
	[isEditorReady, bodyTextData],
	([editorReady, data]) => {
		if (!editorReady || !data) return;

		const documentContent =
			typeof data.bodyTextContent === 'string'
				? JSON.parse(data.bodyTextContent)
				: data.bodyTextContent;

		const dependentFiles = (data.dependentFiles || []).map((f) => ({
			id: f.id,
			url: f.url,
			mimeType: f.mimetype,
		}));

		const references = transformCitationsForEditor(
			props.publication?.citations,
		);
		const missing = validateDocumentResources(
			documentContent,
			dependentFiles,
			references,
		);
		if (missing.length) {
			console.warn('[sciflow] Missing resources:', missing);
		}
		editorRef.value.doc = {
			doc: documentContent,
			files: dependentFiles,
			references,
		};
		currentDocument.value = documentContent;
		savedDocumentSerialized.value = serializeDocument(documentContent);
		isDirty.value = false;

		editorReferences.value = references;
		queueMicrotask(() => syncReferenceListHighlight());
	},
	{immediate: true},
);

// Update reference list when publication (with citations) loads or changes
watch(
	() => props.publication?.citations,
	(citations) => {
		editorReferences.value = transformCitationsForEditor(citations);
		syncReferenceListHighlight();
	},
	{immediate: true, deep: true},
);

/** --------------------------------
 * Editor Event Handlers
 * --------------------------------- */
function handleEditorChange(event) {
	const updatedDoc = event.detail?.doc ?? null;
	const ops = event.detail?.operations ?? [];
	const opRefs = ops
		.map((op) => (Array.isArray(op?.references) ? op.references : []))
		.find((refs) => refs.length > 0);
	const references =
		Array.isArray(event.detail?.references) &&
		event.detail.references.length > 0
			? event.detail.references
			: (opRefs ?? event.detail?.references ?? []);

	currentDocument.value = updatedDoc;
	isDirty.value =
		serializeDocument(updatedDoc) !== savedDocumentSerialized.value;

	if (Array.isArray(references) && references.length > 0) {
		editorReferences.value = references;
	}
	syncReferenceListHighlight();
}

function handleSelectionChange(event) {
	const selection = event.detail;
	const hasRange =
		selection &&
		(typeof selection.anchor === 'number' ||
			typeof selection.from === 'number') &&
		(selection.anchor ?? selection.from) !== (selection.head ?? selection.to);
	const hasNode =
		selection && (selection.node != null || selection.jsonID === 'node');

	if (hasRange || hasNode) {
		openAccordionSection.value = 'selected-element';
	}
	syncReferenceListHighlight();
}

function syncReferenceListHighlight() {
	const refList = document.getElementById('sciflow-references');
	if (!refList || typeof refList.highlight !== 'function') return;
	const view = editorRef.value?.editorView;
	const doc = editorRef.value?.document ?? view?.state?.doc;
	if (!doc) {
		refList.highlight([]);
		return;
	}
	const selection = view?.state?.selection;
	const from = selection?.anchor ?? selection?.from;
	const to = selection?.head ?? selection?.to;
	const hasRange =
		typeof from === 'number' && typeof to === 'number' && from !== to;
	const ids = hasRange
		? getCitedReferenceIds(doc, from, to)
		: getCitedReferenceIds(doc);
	refList.highlight(ids);
}

/** --------------------------------
 * Persistence
 * --------------------------------- */
async function saveDocument() {
	if (!currentDocument.value) return;
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
		saveButtonLabel.value = 'Saved';
		setTimeout(() => (saveButtonLabel.value = 'Save'), 1500);
	}
}

async function handleFigureUpload(file) {
	if (!bodyTextData.value?.id) await saveDocument();
	if (!bodyTextData.value?.id)
		throw new Error('Failed to save document before uploading figure');
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
</script>

<style scoped>
/* ==========================================================================
   SciFlow demo-style layout - all styles scoped to .sciflow-body-text
   to prevent bleeding into parent OJS application
   ========================================================================== */

.sciflow-body-text {
	--sbt-bar: #1e3a5f;
	--sbt-bar-fg: #f0f4f8;
	--sbt-main-bg: #ffffff;
	--sbt-main-fg: #1e293b;
	--sbt-muted: #64748b;
	--sbt-sidebar-bg: #f1f5f9;
	--sbt-sidebar-border: #e2e8f0;
	--sbt-divider: #e2e8f0;
	--sbt-status: #f59e0b;
	display: flex;
	flex: none;
	min-width: 0;
	/* JS sets the exact height via fitContainerHeight(); CSS fallback below */
	height: min(calc(100vh - 22rem), 72vh);
	min-height: 400px;
	overflow: hidden;
	background: var(--sbt-main-bg);
	color: var(--sbt-main-fg);
	font-family:
		system-ui,
		-apple-system,
		BlinkMacSystemFont,
		'Segoe UI',
		Roboto,
		sans-serif;
}

@media (prefers-color-scheme: dark) {
	.sciflow-body-text {
		--sbt-main-bg: #0f172a;
		--sbt-main-fg: #e2e8f0;
		--sbt-muted: #94a3b8;
		--sbt-sidebar-bg: #1e293b;
		--sbt-sidebar-border: rgba(148, 163, 184, 0.3);
		--sbt-divider: rgba(148, 163, 184, 0.35);
	}
}

.sciflow-body-text--fullscreen {
	position: fixed;
	inset: 0;
	z-index: 1000;
	background: var(--sbt-main-bg);
	overflow: hidden;
}

.sciflow-body-text--fullscreen .sciflow-body-text__sidebar {
	width: min(480px, 36vw);
}

.sciflow-body-text--fullscreen:fullscreen,
.sciflow-body-text--fullscreen:-webkit-full-screen {
	width: 100%;
	height: 100%;
}

.sciflow-body-text__main {
	flex: 1;
	min-width: 0;
	min-height: 0;
	display: flex;
	flex-direction: column;
	padding: 1rem 1.5rem;
	overflow: hidden;
}

.sciflow-body-text__editor-section {
	flex: 1;
	min-height: 0;
	display: flex;
	flex-direction: column;
	position: relative;
	z-index: 1;
}

.sciflow-body-text__editor-area {
	flex: 1;
	min-height: 0;
	display: flex;
	flex-direction: column;
	border: 1px solid var(--sbt-sidebar-border);
	border-radius: 8px;
	background: var(--sbt-main-bg);
	overflow: hidden;
}

.sciflow-body-text__editor-scroll {
	flex: 1;
	min-height: 0;
	overflow-y: auto;
	overflow-x: hidden;
	overscroll-behavior: contain;
	scrollbar-color: var(--sbt-sidebar-border) var(--sbt-sidebar-bg);
	scrollbar-width: thin;
}

.sciflow-body-text__editor-toolbar {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	padding: 0.5rem 0.75rem;
	background: var(--sbt-sidebar-bg);
	border-bottom: 1px solid var(--sbt-sidebar-border);
	position: sticky;
	top: 0;
	z-index: 3;
}

.sciflow-body-text__formatbar {
	--sciflow-formatbar-background: transparent;
	--sciflow-formatbar-border: transparent;
	--sciflow-formatbar-button-color: var(--sbt-main-fg);
	--sciflow-formatbar-button-hover: rgba(30, 58, 95, 0.1);
	--sciflow-formatbar-button-active: var(--sbt-bar);
	--sciflow-formatbar-button-active-background: rgba(30, 58, 95, 0.1);
	--sciflow-formatbar-select-background: var(--sbt-main-bg);
	--sciflow-formatbar-select-color: var(--sbt-main-fg);
	--sciflow-formatbar-select-border-disabled: var(--sbt-sidebar-border);
	--sciflow-formatbar-select-background-disabled: var(--sbt-sidebar-bg);
}

.sciflow-body-text__sidebar {
	width: min(320px, 28vw);
	flex-shrink: 0;
	min-height: 0;
	align-self: stretch;
	background: var(--sbt-sidebar-bg);
	border-left: 1px solid var(--sbt-sidebar-border);
	overflow-y: auto;
	overflow-x: hidden;
	overscroll-behavior: contain;
	scrollbar-color: var(--sbt-sidebar-border) var(--sbt-sidebar-bg);
	scrollbar-width: thin;
}

/* Always show scrollbars (macOS hides by default) */
.sciflow-body-text__sidebar::-webkit-scrollbar {
	width: 10px;
}

.sciflow-body-text__sidebar::-webkit-scrollbar-track {
	background: var(--sbt-sidebar-bg);
}

.sciflow-body-text__sidebar::-webkit-scrollbar-thumb {
	background: var(--sbt-sidebar-border);
	border-radius: 5px;
}

.sciflow-body-text__sidebar::-webkit-scrollbar-thumb:hover {
	background: var(--sbt-muted);
}

.sciflow-body-text__sidebar-panel {
	padding: 1rem 1.25rem;
}

.sciflow-body-text__document-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin-bottom: 1rem;
}

.sciflow-body-text__document-bar .sciflow-body-text__panel-title {
	margin: 0;
}

.sciflow-body-text__document-actions {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	flex-wrap: wrap;
	width: 100%;
	font-size: 0.8rem;
	color: var(--sbt-muted);
}

.sciflow-body-text__document-buttons {
	display: flex;
	align-items: center;
	gap: 0.35rem;
	margin-left: auto;
}

.sciflow-body-text__unsaved {
	display: inline-flex;
	align-items: center;
	gap: 0.35rem;
	white-space: nowrap;
	padding: 0.2rem 0.45rem;
	border-radius: 999px;
	border: 1px solid color-mix(in srgb, var(--sbt-status) 45%, transparent);
	background: color-mix(in srgb, var(--sbt-status) 18%, transparent);
	color: var(--sbt-status);
	font-weight: 600;
}

.sciflow-body-text__panel-title {
	margin: 0 0 1rem;
	font-size: 0.8rem;
	font-weight: 600;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	color: var(--sbt-muted);
}

.sciflow-body-text__sidebar-section {
	margin-bottom: 0.75rem;
	border-radius: 8px;
	background: var(--sbt-main-bg);
	border: 1px solid var(--sbt-sidebar-border);
	overflow: hidden;
}

.sciflow-body-text__sidebar-summary {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.5rem;
	padding: 0.6rem 0.85rem;
	font-size: 0.9rem;
	font-weight: 600;
	color: var(--sbt-main-fg);
	background: var(--sbt-main-bg);
	border: none;
	cursor: pointer;
	list-style: none;
	transition: background 0.15s ease;
}

.sciflow-body-text__sidebar-summary::-webkit-details-marker {
	display: none;
}

.sciflow-body-text__sidebar-summary::after {
	content: '▾';
	font-size: 0.75rem;
	color: var(--sbt-muted);
	transition: transform 0.15s ease;
}

.sciflow-body-text__sidebar-section[open]
	> .sciflow-body-text__sidebar-summary::after {
	transform: rotate(180deg);
}

.sciflow-body-text__sidebar-summary:hover {
	background: var(--sbt-sidebar-bg);
}

.sciflow-body-text__sidebar-summary h3 {
	margin: 0;
	font-size: inherit;
	font-weight: inherit;
}

.sciflow-body-text__sidebar-icon {
	width: 18px;
	height: 18px;
	color: var(--sbt-muted);
	flex-shrink: 0;
}

.sciflow-body-text__sidebar-body {
	padding: 0.75rem 0.85rem;
	border-top: 1px solid var(--sbt-sidebar-border);
}

.sciflow-body-text__sidebar-description {
	margin: 0 0 0.75rem;
	font-size: 0.85rem;
	color: var(--sbt-muted);
}

/* sciflow-editor and sciflow-reference-list - use :deep() for web components */
.sciflow-body-text :deep(sciflow-editor) {
	--sciflow-editor-background: var(--sbt-main-bg);
	--sciflow-editor-border: transparent;
	--sciflow-editor-border-active: var(--sbt-bar);
	flex: 0 0 auto;
	display: block;
	min-height: 300px;
}

/* Always show scrollbars for editor and sidebar (macOS hides by default) */
.sciflow-body-text__editor-scroll::-webkit-scrollbar,
.sciflow-body-text__sidebar::-webkit-scrollbar {
	width: 10px;
}

.sciflow-body-text__editor-scroll::-webkit-scrollbar-track,
.sciflow-body-text__sidebar::-webkit-scrollbar-track {
	background: var(--sbt-sidebar-bg);
}

.sciflow-body-text__editor-scroll::-webkit-scrollbar-thumb,
.sciflow-body-text__sidebar::-webkit-scrollbar-thumb {
	background: var(--sbt-sidebar-border);
	border-radius: 5px;
}

.sciflow-body-text__editor-scroll::-webkit-scrollbar-thumb:hover,
.sciflow-body-text__sidebar::-webkit-scrollbar-thumb:hover {
	background: var(--sbt-muted);
}

.sciflow-body-text :deep(sciflow-reference-list)::part(list) {
	display: grid;
	gap: 0.5rem;
	padding: 0;
}

.sciflow-body-text :deep(sciflow-reference-list)::part(item) {
	display: grid;
	gap: 0.3rem;
	padding: 0.6rem 0.75rem;
	border-radius: 8px;
	border: 1px solid var(--sbt-sidebar-border);
	background: var(--sbt-main-bg);
	min-height: 60px;
	min-width: 0;
	overflow: hidden;
}

.sciflow-body-text :deep(sciflow-reference-list)::part(title) {
	font-weight: 600;
	font-size: 0.9rem;
	line-height: 1.3;
	color: var(--sbt-main-fg);
	overflow-wrap: break-word;
	word-break: break-word;
}

.sciflow-body-text :deep(sciflow-reference-list)::part(meta-chip) {
	display: inline-flex;
	align-items: center;
	gap: 0.3rem;
	padding: 0.15rem 0.4rem;
	border-radius: 999px;
	background: rgba(30, 58, 95, 0.12);
	color: var(--sbt-bar);
	font-weight: 500;
	font-size: 0.75rem;
}

@media (prefers-color-scheme: dark) {
	.sciflow-body-text :deep(sciflow-formatbar) {
		--sciflow-formatbar-button-hover: rgba(59, 130, 246, 0.2);
		--sciflow-formatbar-button-active-background: rgba(96, 165, 250, 0.2);
	}
	.sciflow-body-text :deep(sciflow-reference-list)::part(meta-chip) {
		background: rgba(96, 165, 250, 0.25);
	}
}

@media (max-width: 768px) {
	.sciflow-body-text {
		flex-direction: column;
	}
	.sciflow-body-text__sidebar {
		width: 100%;
		border-left: none;
		border-top: 1px solid var(--sbt-sidebar-border);
	}
	.sciflow-body-text :deep(sciflow-editor) {
		min-height: 320px;
	}
}
</style>

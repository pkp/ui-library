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
				{{ t('publication.bodyText') }}
			</h2>
			<BodyTextImportStatus
				:stage="importStage"
				:error="importError"
				:warnings="importWarnings"
				@dismiss="dismissImportStatus"
			/>
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

		<aside
			class="sciflow-body-text__sidebar"
			:aria-label="t('publication.bodyText.documentPanel')"
		>
			<div class="sciflow-body-text__sidebar-panel">
				<div class="sciflow-body-text__document-bar">
					<h2 class="sciflow-body-text__panel-title">
						{{ t('publication.bodyText.documentPanel') }}
					</h2>
					<div class="sciflow-body-text__save-row">
						<PkpButton is-primary @click="saveDocument">
							{{ saveButtonLabel }}
						</PkpButton>
						<Badge
							v-show="isDirty"
							color-variant="primary"
							class="sciflow-body-text__unsaved"
						>
							{{ t('common.unsavedChanges') }}
						</Badge>
					</div>
					<PkpButton
						ref="fullscreenBtnRef"
						:aria-pressed="isFullscreen"
						@click="toggleFullscreen"
					>
						{{
							isFullscreen ? t('common.exitFullscreen') : t('common.fullscreen')
						}}
					</PkpButton>
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
								{{ t('publication.bodyText.references.dragHint') }}
							</p>
							<sciflow-reference-list
								id="sciflow-references"
								:references="references"
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
import {ref, computed, watch, onMounted, nextTick} from 'vue';
import * as sciFlowEditor from '@sciflow/editor-start/bundle';
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';
import Badge from '@/components/Badge/Badge.vue';
import BodyTextImportStatus from './BodyTextImportStatus.vue';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import {useBodyTextEditor} from './useBodyTextEditor.js';
import {useFullscreenFocusTrap} from './useFullscreenFocusTrap.js';
import {useDependentFileUpload} from './useDependentFileUpload.js';
import {useDocumentImport} from './useDocumentImport.js';

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
	getCitedReferenceIds,
	validateDocumentResources,
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
 * Props / Emits
 * --------------------------------- */
const props = defineProps({
	submissionId: {type: Number, required: true},
	publicationId: {type: Number, required: true},
	/** OJS publication citations, shown as the editor's reference list. */
	citations: {type: Array, default: () => []},
	/**
	 * `{url, fileName}` of a document to import into the editor once its own
	 * document is loaded. `fileName` must keep the original extension so the
	 * converter can pick the reader. `import-finished` is emitted afterwards,
	 * whether the import succeeded or not.
	 */
	importFile: {type: Object, default: null},
});

const emit = defineEmits(['import-finished']);

const {t} = useLocalize();
const {loadMathJax, transformCitationsForEditor, serializeDocument} =
	useBodyTextEditor();

/** --------------------------------
 * Reactive State
 * --------------------------------- */
const editorRef = ref(null);
const mainContainerRef = ref(null);
const fullscreenBtnRef = ref(null);

/** OJS citations in SciFlow reference shape: the sidebar list and the
 *  editor's reference registry are both fed from this one value. */
const references = computed(() => transformCitationsForEditor(props.citations));
const currentDocument = ref(null);
const savedDocumentSerialized = ref('');
const isDirty = ref(false);
const isSaved = ref(false);
const saveButtonLabel = computed(() =>
	isSaved.value ? t('form.saved') : t('common.save'),
);

/** Accordion: which section is open (only one at a time) */
const openAccordionSection = ref('references');

/** Sidebar sections */
const sidebarSections = [
	{
		key: 'references',
		title: t('submission.citations'),
		headingId: 'sciflow-references-heading',
		icon: 'EditorMenuBook',
	},
	{
		key: 'selected-element',
		title: t('publication.bodyText.selectedElement'),
		headingId: 'sciflow-selected-heading',
		icon: 'EditorTune',
	},
	{
		key: 'outline',
		title: t('publication.bodyText.outline'),
		headingId: 'sciflow-outline-heading',
		icon: 'EditorToc',
	},
];

const isFullscreen = ref(false);

/** --------------------------------
 * API Endpoints / Data Sources
 * --------------------------------- */
const {apiUrl: bodyTextApiUrl} = useUrl(
	`submissions/${props.submissionId}/publications/${props.publicationId}/bodyText`,
);
const {data: bodyTextData, fetch: fetchBodyText} = useFetch(bodyTextApiUrl);
// Start fetching right away; the document is loaded into the editor in
// onMounted once the editor itself is ready.
const bodyTextRequest = fetchBodyText();

/**
 * The body-text record as last returned by the server (load or save). Its
 * `id` is the submission file that figure images are attached to; it is
 * undefined while the publication has no body text yet.
 */
const bodyTextFile = ref(null);

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
	.editor { flex: 1 1 auto; min-height: 0; overflow-y: auto; }
	.ProseMirror { min-height: 100%; line-height: 1.5; }
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
 * Lifecycle
 * --------------------------------- */
onMounted(async () => {
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

	await bodyTextRequest;
	if (bodyTextData.value) {
		loadDocument(bodyTextData.value);
	}
	await runImport();
});

/** --------------------------------
 * UI Actions
 * --------------------------------- */
function exitFullscreen() {
	if (!isFullscreen.value) return;
	isFullscreen.value = false;
	nextTick(() => {
		fullscreenBtnRef.value?.$el?.focus();
	});
}

function toggleFullscreen() {
	if (isFullscreen.value) {
		exitFullscreen();
		return;
	}
	isFullscreen.value = true;
}

useFullscreenFocusTrap({
	containerRef: mainContainerRef,
	active: isFullscreen,
	onEscape: exitFullscreen,
});

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
/**
 * Put the body-text record from the server into the editor and reset the
 * saved/dirty state to it. Called once, after the editor is ready.
 */
function loadDocument(record) {
	const documentContent =
		typeof record.bodyTextContent === 'string'
			? JSON.parse(record.bodyTextContent)
			: record.bodyTextContent;

	const dependentFiles = (record.dependentFiles || []).map((f) => ({
		id: f.id,
		url: f.url,
		mimeType: f.mimetype,
	}));

	const missing = validateDocumentResources(
		documentContent,
		dependentFiles,
		references.value,
	);
	if (missing.length) {
		console.warn('[sciflow] Missing resources:', missing);
	}
	editorRef.value.doc = {
		doc: documentContent,
		files: dependentFiles,
		references: references.value,
	};
	currentDocument.value = documentContent;
	savedDocumentSerialized.value = serializeDocument(documentContent);
	isDirty.value = false;
	bodyTextFile.value = record;
	queueMicrotask(() => syncReferenceListHighlight());
}

/**
 * When the publication's citations change after load (edited elsewhere in
 * the workflow), replace the editor's reference registry so citation
 * rendering and the selection editor see the same set as the sidebar. The
 * unchanged `doc` is skipped by the editor's deep-equality check.
 */
watch(references, (refs) => {
	const editor = editorRef.value;
	if (!editor || !currentDocument.value) return;
	editor.doc = {doc: currentDocument.value, references: refs};
	syncReferenceListHighlight();
});

/** --------------------------------
 * Editor Event Handlers
 * --------------------------------- */
function handleEditorChange(event) {
	const updatedDoc = event.detail?.doc ?? null;
	currentDocument.value = updatedDoc;
	isDirty.value =
		serializeDocument(updatedDoc) !== savedDocumentSerialized.value;
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
/** Save button handler. Kept argument-free so the click event is not
 *  mistaken for a document. */
async function saveDocument() {
	await persistDocument(currentDocument.value);
}

async function persistDocument(doc) {
	if (!doc) return false;
	const serialized = serializeDocument(doc);
	const formData = new FormData();
	formData.append('bodyText', serialized);
	const {data, fetch} = useFetch(bodyTextApiUrl, {
		method: 'PUT',
		body: formData,
	});
	await fetch();
	if (!data.value) return false;

	bodyTextFile.value = data.value;
	savedDocumentSerialized.value = serialized;
	isDirty.value =
		serializeDocument(currentDocument.value) !== savedDocumentSerialized.value;
	isSaved.value = true;
	setTimeout(() => (isSaved.value = false), 1500);
	return true;
}

/**
 * Dependent files (figure images) hang off the body-text submission file,
 * so it has to exist before the first upload. Resolves to its id, saving
 * the current document first when the publication has no body text yet.
 * Memoised so parallel uploads share one save.
 */
let ensureBodyTextFilePromise = null;

function ensureBodyTextFile() {
	if (bodyTextFile.value?.id) return Promise.resolve(bodyTextFile.value.id);
	if (!ensureBodyTextFilePromise) {
		ensureBodyTextFilePromise = persistDocument(currentDocument.value)
			.then(() => bodyTextFile.value?.id ?? null)
			.finally(() => {
				ensureBodyTextFilePromise = null;
			});
	}
	return ensureBodyTextFilePromise;
}

const {uploadFile} = useDependentFileUpload({
	submissionId: props.submissionId,
	getAssocId: ensureBodyTextFile,
});
const {openDialog} = useModal();

/** Upload callback for the editor's figure feature (manual image insert). */
async function handleFigureUpload(file) {
	const result = await uploadFile(file);
	if (!result.id) {
		openDialog({
			title: t('common.error'),
			message: result.error,
			actions: [{label: t('common.ok'), callback: (close) => close()}],
			modalStyle: 'negative',
		});
		throw new Error(result.error);
	}
	return result;
}

/** --------------------------------
 * Document import
 * --------------------------------- */
const {stage: importStage, importDocument} = useDocumentImport({uploadFile});
const importError = ref('');
const importWarnings = ref([]);

function dismissImportStatus() {
	importError.value = '';
	importWarnings.value = [];
}

/** Import `props.importFile`, if any, replacing the current document. */
async function runImport() {
	if (!props.importFile) return;
	dismissImportStatus();
	try {
		const {doc, uploadedFiles, warnings} = await importDocument(
			props.importFile,
		);
		importWarnings.value = warnings;
		applyImportedDocument(doc, uploadedFiles);
	} catch (cause) {
		importError.value = cause?.message || String(cause);
	} finally {
		emit('import-finished');
	}
}

/**
 * Replace the editor document with an imported one. Setting `doc` on the
 * editor element after initialisation goes through the editor's
 * external-update path: it replaces the document, registers `files` with the
 * figure feature and emits `editor-change`, which updates `currentDocument`
 * and the dirty state through `handleEditorChange`.
 */
function applyImportedDocument(doc, uploadedFiles) {
	const editor = editorRef.value;
	if (!editor || !doc) return;
	editor.doc = {
		doc,
		files: [...uploadedFiles],
		references: references.value,
	};
	editor.editorView?.focus?.();
}

defineExpose({isDirty});
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
	/* Viewport height minus the modal's outer sticky chrome (~16rem). The
	   modal scrolls naturally to reveal the workflow page header above. */
	height: calc(100vh - 20rem);
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
	width: 100%;
	height: 100%;
	z-index: 1000;
	background: var(--sbt-main-bg);
	overflow: hidden;
}

.sciflow-body-text--fullscreen .sciflow-body-text__sidebar {
	width: min(480px, 36vw);
}

.sciflow-body-text__main {
	flex: 1;
	min-width: 0;
	min-height: 0;
	display: flex;
	flex-direction: column;
	padding-inline-end: 1.5rem;
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
	background: var(--sbt-main-bg);
	overflow: hidden;
}

.sciflow-body-text__editor-scroll {
	flex: 1;
	min-height: 0;
	display: flex;
	flex-direction: column;
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
	border-inline-start: 1px solid var(--sbt-sidebar-border);
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
	flex-direction: column;
	align-items: flex-start;
	gap: 0.5rem;
	margin-bottom: 1rem;
}

.sciflow-body-text__document-bar .sciflow-body-text__panel-title {
	margin: 0;
}

.sciflow-body-text__save-row {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	align-self: stretch;
}

.sciflow-body-text__unsaved {
	margin-inline-start: auto;
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
	/* Flex column so the shadow-DOM .editor child can grow to fill the host.
	   See PROSEMIRROR_SHADOW_STYLES for the matching .editor rule. */
	display: flex;
	flex-direction: column;
	flex: 1 1 auto;
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
		border-inline-start: none;
		border-top: 1px solid var(--sbt-sidebar-border);
	}
	.sciflow-body-text :deep(sciflow-editor) {
		min-height: 320px;
	}
}
</style>

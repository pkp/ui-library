<template>
	<div class="flex flex-col gap-4">
		<div>
			<PkpButton @click="saveDocument">Save</PkpButton>
		</div>
		<div class="flex gap-4">
			<div class="w-3/5">
				<sciflow-formatbar for="sciflow-editor"></sciflow-formatbar>
				<sciflow-editor id="sciflow-editor" ref="editorRef"></sciflow-editor>
			</div>
			<div class="w-2/5">
				<h2 class="text-lg-bold">Selected Element</h2>
				<sciflow-selection-editor
					for="sciflow-editor"
				></sciflow-selection-editor>
				<h2 class="mt-4 text-lg-bold">References</h2>
				<sciflow-reference-list
					id="sciflow-references"
					ref="referenceListRef"
				></sciflow-reference-list>
			</div>
		</div>
	</div>
</template>

<script setup>
import {ref, watch, onMounted} from 'vue';
import {
	citationFeature,
	listFeature,
	blockquoteFeature,
	copyPasteFeature,
	headingFeature,
	createFigureFeature,
	SourceField,
} from '@sciflow/editor-start/dist/bundle/sciflow-editor.js';
import PkpButton from '@/components/Button/Button.vue';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';

const props = defineProps({
	submission: {type: Object, required: true},
	publication: {type: Object, required: true},
});

/** Template refs */
const editorRef = ref(null);
const referenceListRef = ref(null);

/** Track if editor is mounted and configured */
const isEditorReady = ref(false);

/** Current document state from editor */
const currentDocument = ref(null);

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

/** Editor features configuration */
const editorFeatures = [
	citationFeature,
	headingFeature,
	listFeature,
	blockquoteFeature,
	copyPasteFeature,
	createFigureFeature({imageUpload: {uploadFile: handleFigureUpload}}),
];

onMounted(async () => {
	const editor = editorRef.value;
	if (!editor) {
		return;
	}

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

		editorRef.value.doc = {doc: documentContent, files: dependentFiles};
		currentDocument.value = documentContent;
	},
	{immediate: true},
);

function handleEditorChange(event) {
	currentDocument.value = event.detail.doc;
}

function handleSelectionChange(event) {
	if (!referenceListRef.value) {
		return;
	}

	const selection = event.detail;
	const view = editorRef.value?.editorView;

	if (!view || !selection) {
		referenceListRef.value.highlight([]);
		return;
	}

	const referencedIds = extractReferencedIds(view, selection);
	referenceListRef.value.highlight(referencedIds);
}

function extractReferencedIds(view, selection) {
	const from = Math.min(selection.anchor, selection.head);
	const to = Math.max(selection.anchor, selection.head);
	const citations = [];

	view.state.doc.nodesBetween(from, Math.max(to, from + 1), (node) => {
		if (node.type.name !== 'citation') {
			return;
		}
		const sourceEntries = SourceField.fromString(node.attrs?.source ?? null);
		citations.push({source: sourceEntries});
	});

	return citations.flatMap((citation) =>
		citation.source
			.map((entry) => (typeof entry?.id === 'string' ? entry.id.trim() : null))
			.filter(Boolean),
	);
}

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

function transformCitationsForEditor(citations) {
	return (citations || []).map((citation) => ({
		...citation,
		id: String(citation.id),
	}));
}
</script>

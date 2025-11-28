<template>
	<div class="flex flex-col gap-4">
		<div>
			<PkpButton @click="saveDocument">Save</PkpButton>
		</div>
		<div class="flex gap-4">
			<div class="w-3/5">
				<sciflow-formatbar for="sciflow-editor"></sciflow-formatbar>
				<sciflow-editor id="sciflow-editor"></sciflow-editor>
			</div>
			<div class="w-2/5">
				<h2 class="text-lg-bold">Selected Element</h2>
				<sciflow-selection-editor
					for="sciflow-editor"
				></sciflow-selection-editor>
				<h2 class="mt-4 text-lg-bold">References</h2>
				<sciflow-reference-list
					id="sciflow-references"
				></sciflow-reference-list>
			</div>
		</div>
	</div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
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

/** Current body text metadata (updated after save) */
const bodyTextMeta = ref(null);

/** Current document state from editor */
const currentDocument = ref(null);

/** API URL for submission files */
const {apiUrl: filesApiUrl} = useUrl(
	`submissions/${props.submission.id}/files`,
);

/** Editor features configuration */
const editorFeatures = [
	citationFeature,
	headingFeature,
	listFeature,
	blockquoteFeature,
	copyPasteFeature,
	createFigureFeature({imageUpload: {uploadFile: handleFigureUpload}}),
];

/** Default document shown when no body text file exists */
const defaultDocument = {
	type: 'doc',
	content: [
		{
			type: 'heading',
			attrs: {level: 1},
			content: [{type: 'text', text: 'Introduction'}],
		},
		{
			type: 'paragraph',
			content: [
				{type: 'text', text: 'Start writing your article content here...'},
			],
		},
	],
};

onMounted(async () => {
	const editor = getEditorElement();
	const referenceList = getReferenceListElement();
	const toolbar = document.querySelector('sciflow-formatbar');

	if (!editor || !toolbar) {
		return;
	}

	// 1. Configure editor
	await editor.configureFeatures(editorFeatures);
	editor.addEventListener('editor-change', handleEditorChange);
	editor.addEventListener('editor-selection-change', handleSelectionChange);

	// 2. Load references
	if (referenceList) {
		referenceList.references = transformCitationsForEditor(
			props.publication.citations,
		);
	}

	// 3. Load document
	await loadDocument(editor);
});

async function loadDocument(editor) {
	const fetchedBodyTextMeta = await fetchBodyTextMeta();

	if (fetchedBodyTextMeta) {
		bodyTextMeta.value = fetchedBodyTextMeta;

		const [bodyTextContent, bodyTextMetaFull] = await Promise.all([
			fetchBodyTextContent(fetchedBodyTextMeta.url),
			// Fetch full metadata to get list of dependent files (images)
			fetchBodyTextMetaFull(fetchedBodyTextMeta.id),
		]);

		const dependentFiles = (bodyTextMetaFull.dependentFiles || []).map((f) => ({
			id: f.id,
			url: f.url,
			mimeType: f.mimetype,
		}));

		editor.doc = {doc: bodyTextContent, files: dependentFiles};
	} else {
		editor.doc = {doc: defaultDocument, files: []};
		currentDocument.value = defaultDocument;
	}
}

async function fetchBodyTextMeta() {
	const {data, fetch} = useFetch(filesApiUrl, {
		query: {fileStages: pkp.const.SUBMISSION_FILE_BODY_TEXT},
	});
	await fetch();
	return data.value?.items?.[0] || null;
}

async function fetchBodyTextContent(url) {
	const {data, fetch} = useFetch(url);
	await fetch();
	return data.value;
}

async function fetchBodyTextMetaFull(bodyTextMetaId) {
	const {data, fetch} = useFetch(`${filesApiUrl.value}/${bodyTextMetaId}`, {
		query: {stageId: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION},
	});
	await fetch();
	return data.value;
}

function handleEditorChange(event) {
	currentDocument.value = event.detail.doc;
}

function handleSelectionChange(event) {
	const referenceList = getReferenceListElement();
	if (!referenceList) {
		return;
	}

	const selection = event.detail;
	const editor = getEditorElement();
	const view = editor?.editorView;

	if (!view || !selection) {
		referenceList.highlight([]);
		return;
	}

	const referencedIds = extractReferencedIds(view, selection);
	referenceList.highlight(referencedIds);
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

	const jsonBlob = new Blob([JSON.stringify(currentDocument.value)], {
		type: 'application/json',
	});

	if (bodyTextMeta.value) {
		await updateExistingFile(jsonBlob);
	} else {
		await createNewFile(jsonBlob);
		bodyTextMeta.value = await fetchBodyTextMeta();
	}
}

async function updateExistingFile(blob) {
	const {apiUrl} = useUrl(
		`submissions/${props.submission.id}/files/${bodyTextMeta.value.id}`,
	);

	const formData = new FormData();
	formData.append('file', blob);

	const {fetch} = useFetch(apiUrl, {
		method: 'PUT',
		query: {stageId: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION},
		body: formData,
	});

	await fetch();
}

async function createNewFile(blob) {
	const formData = new FormData();
	formData.append('fileStage', String(pkp.const.SUBMISSION_FILE_BODY_TEXT));
	formData.append('assocId', props.publication.id);
	formData.append('assocType', pkp.const.ASSOC_TYPE_PUBLICATION);
	formData.append('file', blob);

	const {fetch} = useFetch(filesApiUrl, {
		method: 'POST',
		body: formData,
	});

	await fetch();
}

async function handleFigureUpload(file) {
	// Auto-save document first if no body text file exists yet
	if (!bodyTextMeta.value) {
		await saveDocument();
	}

	if (!bodyTextMeta.value) {
		throw new Error('Failed to save document before uploading figure');
	}

	const formData = new FormData();
	formData.append('fileStage', String(pkp.const.SUBMISSION_FILE_DEPENDENT));
	formData.append('assocId', bodyTextMeta.value.id);
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

function getEditorElement() {
	return document.getElementById('sciflow-editor');
}

function getReferenceListElement() {
	return document.getElementById('sciflow-references');
}

function transformCitationsForEditor(citations) {
	return (citations || []).map((citation) => ({
		...citation,
		id: String(citation.id),
	}));
}
</script>

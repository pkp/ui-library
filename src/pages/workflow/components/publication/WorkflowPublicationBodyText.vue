<template>
	<div><PkpButton @click="onSave">Save</PkpButton></div>
	<div class="flex">
		<div class="w-3/5">
			<sciflow-formatbar for="editor"></sciflow-formatbar>
			<sciflow-editor id="editor"></sciflow-editor>
		</div>
		<div class="w-2/5">
			<h2 id="selected-element-heading">Selected Element</h2>
			<sciflow-selection-editor for="editor"></sciflow-selection-editor>
			<h2>References</h2>
			<sciflow-reference-list id="references"></sciflow-reference-list>
		</div>
	</div>
</template>

<script setup>
import {computed, ref, watch, onMounted} from 'vue';
//import '@/sciflow-editor-demo/dist/bundle/sciflow-editor';

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

let latestDoc = null;

let editor;
let referenceList;

const featureList = [
	citationFeature,
	headingFeature,
	listFeature,
	blockquoteFeature,
	copyPasteFeature,
	createFigureFeature({imageUpload: {uploadFile: onFigureUpload}}),
];

/**
 * Transform OJS citations to the format expected by sciflow-reference-list.
 * The sciflow editor requires references to have a string `id` for drag & drop to work.
 */
function transformCitationsForSciflow(citations) {
	return (citations || []).map((citation) => ({
		...citation,
		// Convert numeric ID to string for sciflow compatibility
		id: String(citation.id),
	}));
}

onMounted(async () => {
	editor = document.querySelector('sciflow-editor');
	referenceList = document.getElementById('references');
	referenceList.references = transformCitationsForSciflow(
		props.publication.citations,
	);

	const toolbar = document.querySelector('sciflow-formatbar');
	if (editor && toolbar) {
		await editor.configureFeatures(featureList);

		editor.addEventListener('editor-change', async (event) => {
			const {doc, operations, files} = event.detail;
			console.log('editor-change, files:', files);
			console.log('[demo] Updated doc', doc, operations);
			latestDoc = doc;
		});

		// Handle selection changes to highlight references when citations are selected
		editor.addEventListener('editor-selection-change', (event) => {
			const selection = event.detail;
			const view = editor.editorView;
			if (!view || !selection) {
				referenceList.highlight([]);
				return;
			}

			// Get the selection range (handles both cursor position and selection)
			const from = Math.min(selection.anchor, selection.head);
			const to = Math.max(selection.anchor, selection.head);
			const citations = [];

			// Walk through all nodes in/around the selection to find citations
			// Using from, to+1 ensures we catch citations when cursor is at position
			view.state.doc.nodesBetween(from, Math.max(to, from + 1), (node) => {
				if (node.type.name !== 'citation') {
					return;
				}

				// Parse citation source (CSL format stored as URI-encoded JSON)
				const sourceEntries = SourceField.fromString(
					node.attrs?.source ?? null,
				);
				citations.push({
					id: node.attrs?.id ?? null,
					source: sourceEntries,
				});
			});

			// Extract all reference IDs from the selected citations
			const referencedIds = citations.flatMap((citation) =>
				citation.source
					.map((entry) =>
						typeof entry?.id === 'string' ? entry.id.trim() : null,
					)
					.filter((id) => id),
			);

			referenceList.highlight(referencedIds);
		});
	}
});

const {apiUrl: filesApiUrl} = useUrl(
	`submissions/${props.submission.id}/files`,
);

const {data: bodyTextSubmissionFiles, fetch: fetchBodyTextSubmissionFiles} =
	useFetch(filesApiUrl, {
		query: {
			fileStages: 22,
		},
	});

fetchBodyTextSubmissionFiles();

const bodyTextSubmissionFile = computed(() => {
	if (
		bodyTextSubmissionFiles.value?.items &&
		bodyTextSubmissionFiles.value?.items?.length
	) {
		return bodyTextSubmissionFiles.value.items[0];
	}

	return null;
});

const bodyTextSubmissionFileContent = ref(null);

watch(bodyTextSubmissionFile, async (newBodyTextSubmissionFile) => {
	if (!newBodyTextSubmissionFile) {
		return;
	}
	const {data: fileBody, fetch} = useFetch(newBodyTextSubmissionFile.url);

	await fetch();

	bodyTextSubmissionFileContent.value = fileBody.value;
});
const bodyTextSubmissionFileDetails = ref(null);

watch(bodyTextSubmissionFile, async (newBodyTextSubmissionFile) => {
	if (!newBodyTextSubmissionFile) {
		return;
	}

	const {data: fileBody, fetch} = useFetch(
		`${filesApiUrl.value}/${newBodyTextSubmissionFile.id}`,
		{query: {stageId: 5}},
	);

	await fetch();

	bodyTextSubmissionFileDetails.value = fileBody.value;
});

watch(
	[bodyTextSubmissionFileContent, bodyTextSubmissionFileDetails],

	([contentNew, fileDetailsNew]) => {
		if (contentNew && fileDetailsNew) {
			const fileList = fileDetailsNew.dependentFiles.map((file) => ({
				id: file.id,
				url: file.url,
				mimeType: file.mimetype,
			}));

			editor.doc = {doc: contentNew, files: fileList};
		}
	},
);

async function onSave() {
	// check if there is existing file
	// if there is existing update that
	if (bodyTextSubmissionFile.value) {
		const {apiUrl: postFileApiUrl} = useUrl(
			`submissions/${props.submission.id}/files/${bodyTextSubmissionFile.value.id}`,
		);

		// Create FormData object
		const formData = new FormData();

		const jsonBlob = new Blob([JSON.stringify(latestDoc)], {
			type: 'application/json',
		});

		formData.append('file', jsonBlob);
		const {fetch: postNewFile} = useFetch(postFileApiUrl, {
			method: 'PUT',
			query: {stageId: 5},
			body: formData,
		});

		await postNewFile();
	} else {
		// if there is no existing create new one

		const {apiUrl: postFileApiUrl} = useUrl(
			`submissions/${props.submission.id}/files`,
		);

		// Create FormData object
		const formData = new FormData();

		formData.append('fileStage', '22');
		formData.append('assocId', props.publication.id);
		formData.append('assocType', 1048588);

		const jsonBlob = new Blob([JSON.stringify(latestDoc)], {
			type: 'application/json',
		});

		formData.append('file', jsonBlob);
		const {fetch: postNewFile} = useFetch(postFileApiUrl, {
			method: 'POST',
			body: formData,
		});

		await postNewFile();
	}
}

async function onFigureUpload(file) {
	const {apiUrl: postFileApiUrl} = useUrl(
		`submissions/${props.submission.id}/files`,
	);

	// Create FormData object
	const formData = new FormData();

	formData.append('fileStage', '17'); // SUBMISSION_FILE_DEPENDENT
	formData.append('assocId', bodyTextSubmissionFile.value.id);
	formData.append('assocType', 515); //ASSOC_TYPE_SUBMISSION_FILE

	formData.append('file', file);
	const {data: newFile, fetch: postNewFile} = useFetch(postFileApiUrl, {
		method: 'POST',
		body: formData,
	});

	await postNewFile();

	console.log('returning:', {
		id: newFile.value.id,
		/*mimeType: file.type || 'application/octet-stream',*/
		url: newFile.url, // full-resolution URL stored in snapshot files
		/*previewSrc: resolvePreview(asset), // optional preview shown in the doc*/
	});

	return {
		id: newFile.value.id,
		/*mimeType: file.type || 'application/octet-stream',*/
		url: newFile.value.url, // full-resolution URL stored in snapshot files
		/*previewSrc: resolvePreview(asset), // optional preview shown in the doc*/
	};
}
</script>

<style></style>

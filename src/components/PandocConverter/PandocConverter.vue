<template>
	<div class="pandoc-converter">
		<input
			ref="fileInputRef"
			type="file"
			accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
			class="pandoc-converter__file-input"
			@change="handleFileSelected"
		/>
		<PkpButton :is-disabled="disabled || isBusy" @click="openFilePicker">
			{{ isBusy ? stageLabel : buttonLabel }}
		</PkpButton>
		<span v-if="lastError" class="pandoc-converter__error" role="alert">
			{{ lastError }}
		</span>
	</div>
</template>

<script setup>
import {ref, watch} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import {useQueryParams} from '@/composables/useQueryParams';
import {loadPandoc} from './pandocLoader.js';

const props = defineProps({
	uploadImage: {type: Function, required: true},
	disabled: {type: Boolean, default: false},
	buttonLabel: {type: String, default: 'Import DOCX'},
});

const emit = defineEmits(['html-ready', 'error']);

const fileInputRef = ref(null);
const isBusy = ref(false);
const stageLabel = ref('');
const lastError = ref('');

let pandocInstance = null;

const SIZE_WARN_BYTES = 20 * 1024 * 1024;

function openFilePicker() {
	lastError.value = '';
	fileInputRef.value?.click();
}

async function handleFileSelected(event) {
	const file = event.target.files?.[0];
	event.target.value = '';
	await importFile(file);
}

async function importFile(file) {
	if (!file) return;

	if (file.size > SIZE_WARN_BYTES) {
		console.warn(
			`[pandoc-converter] Large DOCX (${Math.round(file.size / 1024 / 1024)} MB) — conversion may be slow.`,
		);
	}

	isBusy.value = true;
	lastError.value = '';
	try {
		if (!pandocInstance) {
			stageLabel.value = 'Loading converter…';
			pandocInstance = await loadPandoc();
		}

		stageLabel.value = 'Converting…';
		const result = await pandocInstance.convert(
			{
				from: 'docx',
				to: 'html',
				'input-files': ['input.docx'],
				'extract-media': 'media',
				wrap: 'none',
			},
			null,
			{'input.docx': file},
		);
		if (result.stderr) console.log('[pandoc stderr]', result.stderr);
		console.log('[pandoc] raw HTML', result.stdout);
		console.log(
			'[pandoc] mediaFiles keys',
			Object.keys(result.mediaFiles || {}),
		);

		stageLabel.value = 'Uploading images…';
		const {html, images, warnings} = await rewriteImages(
			result.stdout,
			result.mediaFiles || {},
		);
		console.log('[pandoc] rewritten HTML', html);

		emit('html-ready', {
			html,
			images,
			warnings: [...warnings, ...(result.warnings || []).map(warningText)],
		});
	} catch (cause) {
		lastError.value = cause?.message || String(cause);
		emit('error', {
			stage: stageLabel.value || 'convert',
			message: lastError.value,
			cause,
		});
	} finally {
		isBusy.value = false;
		stageLabel.value = '';
	}
}

defineExpose({importFile});

/**
 * Auto-import flow: when landed on this page via FileManager's "Send to
 * Text Editor" action, the URL carries ?importDocxFileUrl=... — fetch it,
 * wrap into a File, and run the same pipeline. Fires once per mount.
 */
const queryParams = useQueryParams();
let autoImportDone = false;

watch(
	() => [props.disabled, queryParams.importDocxFileUrl],
	async ([disabled, url]) => {
		if (autoImportDone || disabled || !url) return;
		autoImportDone = true;
		try {
			const res = await fetch(url);
			if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
			const blob = await res.blob();
			await importFile(new File([blob], 'import.docx'));
		} catch (cause) {
			lastError.value = cause?.message || String(cause);
			emit('error', {stage: 'fetch', message: lastError.value, cause});
		} finally {
			queryParams.importDocxFileUrl = null;
		}
	},
	{immediate: true},
);

async function rewriteImages(htmlString, mediaFiles) {
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlString, 'text/html');
	const container = doc.body;

	const imgs = Array.from(container.querySelectorAll('img'));
	const images = [];
	const warnings = [];

	for (const [index, img] of imgs.entries()) {
		const src = img.getAttribute('src') || '';
		if (!src || /^(https?|data):/i.test(src)) {
			if (src) warnings.push(`External image src left unchanged: ${src}`);
			continue;
		}

		const key = [src, src.replace(/^\.?\//, ''), basename(src)].find(
			(k) => mediaFiles[k],
		);
		if (!key) {
			warnings.push(
				`No extracted media for src="${src}" (image #${index + 1})`,
			);
			continue;
		}

		const name = basename(src) || `image-${index + 1}`;
		const file = new File([mediaFiles[key]], name);
		delete mediaFiles[key];

		const {id, url} = await props.uploadImage(file);
		img.setAttribute('src', url);
		img.dataset.fileId = String(id);
		images.push({name, id, url});
	}

	return {html: container.innerHTML, images, warnings};
}

function basename(path) {
	const clean = path.split(/[?#]/)[0];
	const parts = clean.split('/');
	return decodeURIComponent(parts[parts.length - 1] || '');
}

function warningText(w) {
	return typeof w === 'string' ? w : w?.pretty || w?.type || JSON.stringify(w);
}
</script>

<style scoped>
.pandoc-converter {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 0;
}

.pandoc-converter__file-input {
	display: none;
}

.pandoc-converter__error {
	color: #b91c1c;
	font-size: 0.85rem;
}
</style>

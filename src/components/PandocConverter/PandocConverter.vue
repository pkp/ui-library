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
import {ref} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
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
	if (!file) return;

	if (file.size > SIZE_WARN_BYTES) {
		console.warn(
			`[pandoc-converter] Large DOCX (${Math.round(file.size / 1024 / 1024)} MB) — conversion may be slow.`,
		);
	}

	isBusy.value = true;
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
				'embed-resources': true,
				standalone: true,
				wrap: 'none',
			},
			null,
			{'input.docx': file},
		);
		if (result.stderr) console.log('[pandoc stderr]', result.stderr);

		stageLabel.value = 'Uploading images…';
		const {html, images, warnings} = await rewriteImages(result.stdout);

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

async function rewriteImages(htmlString) {
	const parser = new DOMParser();
	// With --standalone the output is a full <html> document; extract <body>.
	const doc = parser.parseFromString(htmlString, 'text/html');
	const container = doc.body;

	const imgs = Array.from(container.querySelectorAll('img'));
	const images = [];
	const warnings = [];

	for (const [index, img] of imgs.entries()) {
		const src = img.getAttribute('src') || '';
		if (!src) continue;
		if (!src.startsWith('data:')) {
			warnings.push(`Non-data image src left unchanged: ${src}`);
			continue;
		}

		const blob = await (await fetch(src)).blob();
		const ext = (blob.type.split('/')[1] || 'png').split('+')[0];
		const name = `image-${index + 1}.${ext}`;
		const file = new File([blob], name, {type: blob.type});

		const {id, url} = await props.uploadImage(file);
		img.setAttribute('src', url);
		img.dataset.fileId = String(id);
		images.push({name, id, url});
	}

	return {html: container.innerHTML, images, warnings};
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

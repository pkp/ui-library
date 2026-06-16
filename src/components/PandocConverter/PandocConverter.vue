<template>
	<div
		v-if="isBusy || lastError"
		role="status"
		aria-live="polite"
		class="my-4 flex w-full items-center gap-4 rounded border p-4"
		:class="
			lastError ? 'border-negative bg-secondary' : 'border-light bg-secondary'
		"
	>
		<Spinner v-if="isBusy" size-variant="big" />

		<div class="flex flex-grow flex-col gap-1">
			<p
				class="text-lg-medium"
				:class="lastError ? 'text-negative' : 'text-heading'"
			>
				{{
					lastError
						? t('publication.bodyText.import.failed')
						: t('publication.bodyText.import.importing')
				}}
			</p>
			<p class="text-base-normal text-secondary">
				{{ lastError || stageLabel }}
			</p>
		</div>

		<PkpButton v-if="lastError" @click="lastError = ''">
			{{ t('common.dismiss') }}
		</PkpButton>
	</div>
</template>

<script setup>
import {ref, computed, watch} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import {useQueryParams} from '@/composables/useQueryParams';
import {useLocalize} from '@/composables/useLocalize';
import {loadPandoc} from './pandocLoader.js';

const props = defineProps({
	uploadImage: {type: Function, required: true},
	disabled: {type: Boolean, default: false},
});

const emit = defineEmits(['html-ready']);

const {t, tk} = useLocalize();

const isBusy = ref(false);
const lastError = ref('');

// Tracks the current processing status shown to the user during import.
const stage = ref('');
const STAGE_LABELS = {
	download: tk('publication.bodyText.import.downloading'),
	load: tk('publication.bodyText.import.loadingConverter'),
	convert: tk('publication.bodyText.import.converting'),
	upload: tk('publication.bodyText.import.uploadingImages'),
};
const stageLabel = computed(() =>
	STAGE_LABELS[stage.value] ? t(STAGE_LABELS[stage.value]) : '',
);

let pandocInstance = null;

async function runConversion(file) {
	if (!file) return;

	try {
		if (!pandocInstance) {
			stage.value = 'load';
			pandocInstance = await loadPandoc();
		}

		stage.value = 'convert';
		// `from` is omitted so pandoc infers the input format from the
		// filename extension (file.name carries the original extension).
		const result = await pandocInstance.convert(
			{
				to: 'html',
				'input-files': [file.name],
				'extract-media': 'media',
				wrap: 'none',
			},
			null,
			{[file.name]: file},
		);

		stage.value = 'upload';
		const html = await rewriteImages(result.stdout, result.mediaFiles || {});

		emit('html-ready', {html});
	} catch (cause) {
		lastError.value = cause?.message || String(cause);
	}
}

/**
 * Auto-import flow: when landed on this page via FileManager's "Send to
 * Text Editor" action, the URL carries ?importFileUrl=...&importFileName=...
 * — fetch it, wrap into a File (keeping the original name so pandoc can
 * detect the format), and run the conversion pipeline. Fires once per mount.
 */
const queryParams = useQueryParams();
let autoImportDone = false;

watch(
	() => [props.disabled, queryParams.importFileUrl, queryParams.importFileName],
	async ([disabled, url, fileName]) => {
		if (autoImportDone || disabled || !url || !fileName) return;
		autoImportDone = true;
		isBusy.value = true;
		try {
			stage.value = 'download';
			const res = await fetch(url);
			if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
			const blob = await res.blob();
			await runConversion(new File([blob], fileName));
		} catch (cause) {
			lastError.value = cause?.message || String(cause);
		} finally {
			isBusy.value = false;
			stage.value = '';
			queryParams.importFileUrl = null;
			queryParams.importFileName = null;
		}
	},
	{immediate: true},
);

async function rewriteImages(htmlString, mediaFiles) {
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlString, 'text/html');
	const container = doc.body;

	const imgs = Array.from(container.querySelectorAll('img'));

	for (const [index, img] of imgs.entries()) {
		const src = img.getAttribute('src') || '';
		// pandoc keys mediaFiles by the exact src it writes into the HTML, so a
		// direct lookup is enough. Anything not extracted as local media (empty
		// src, external http(s) URLs, inline data: URIs) isn't in mediaFiles and
		// is left untouched.
		const blob = mediaFiles[src];
		if (!blob) continue;

		const name = basename(src) || `image-${index + 1}`;
		const file = new File([blob], name);
		delete mediaFiles[src];

		const {id, url} = await props.uploadImage(file);
		img.setAttribute('src', url);
		img.dataset.fileId = String(id);
	}

	return container.innerHTML;
}

function basename(path) {
	const clean = path.split(/[?#]/)[0];
	const parts = clean.split('/');
	return decodeURIComponent(parts[parts.length - 1] || '');
}
</script>

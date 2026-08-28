<template>
	<div :class="cn('root')">
		<button
			:class="cn('button')"
			:disabled="copying"
			@click="copyToClipboard()"
		>
			<slot />
		</button>
		<Transition>
			<div v-if="success" :class="cn('alert')" role="alert">
				{{ success }}
			</div>
		</Transition>
	</div>
</template>

<script setup>
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {ref} from 'vue';

const props = defineProps({
	styles: {type: Object, default: () => ({})},
	copy: {type: String},
	tCopied: {type: String},
});

const {cn} = usePkpStyles('PkpCopyToClipboard', props.styles);

const copying = ref(false);
const success = ref('');

/**
 * Copy the text to clipboard with both HTML and plain text
 * representations, preserving formatting when pasting into rich-text editors
 */
async function copyToClipboard() {
	copying.value = true;
	const tempDiv = document.createElement('div');
	tempDiv.innerHTML = props.copy;
	const plainText = tempDiv.textContent || tempDiv.innerText || '';

	try {
		const htmlBlob = new Blob([props.copy], {type: 'text/html'});
		const textBlob = new Blob([plainText], {type: 'text/plain'});
		await navigator.clipboard.write([
			new ClipboardItem({
				'text/html': htmlBlob,
				'text/plain': textBlob,
			}),
		]);
		success.value = props.tCopied;
	} catch {
		// Fallback to plain text if ClipboardItem not supported
		try {
			await navigator.clipboard.writeText(plainText);
		} catch (err) {
			// Clipboard API not available or denied
			success.value = err;
		}
	}
	setTimeout(() => {
		copying.value = false;
		success.value = '';
	}, 1500);
}
</script>

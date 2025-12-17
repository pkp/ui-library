<template>
	<div
		v-for="file in selectedFiles"
		:key="file.id"
		class="flex items-center justify-between border-t border-light px-1 py-2"
	>
		<File
			:document-type="file.documentType"
			:file-id="file.id"
			:name="localize(file.name)"
			:url="file.url"
		/>
		<PkpButton
			:is-link="true"
			:is-warnable="true"
			@click="emit('remove-file', file.id)"
		>
			{{ t('common.remove') }}
		</PkpButton>
	</div>
</template>
<script setup>
import {localize, t} from '@/utils/i18n';
import PkpButton from '@/components/Button/Button.vue';
import File from '@/components/File/File.vue';

defineProps({
	selectedFiles: {
		type: Array,
		default: () => [],
	},
});

const emit = defineEmits(['remove-file']);
</script>

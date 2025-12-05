<template>
	<div class="">
		<div
			v-for="file in selectedFiles"
			:key="file.id"
			class="flex items-center justify-between border-t border-light px-1 py-2"
		>
			<div class="flex items-center gap-2">
				<div class="flex items-center justify-center">
					<Icon
						:icon="getFileIcon(file)"
						class="h-6 w-6 flex-none text-heading"
					/>
				</div>

				<div class="text-lg-normal">
					<span class="text-gray-500 text-sm mr-2">{{ file.id }}</span>
					<a target="_blank" class="text-primary" :href="file.url">
						{{ localize(file.name) }}
					</a>
				</div>
			</div>

			<PkpButton
				:is-link="true"
				:is-warnable="true"
				@click="emit('remove-file', file.id)"
			>
				{{ t('common.remove') }}
			</PkpButton>
		</div>
	</div>
</template>
<script setup>
import {localize, t} from '@/utils/i18n';
import Icon from '@/components/Icon/Icon.vue';
import PkpButton from '@/components/Button/Button.vue';

defineProps({
	selectedFiles: {
		type: Array,
		default: () => [],
	},
});

const emit = defineEmits('remove-file');

function getFileIcon(file) {
	return !!pkp.documentTypeIcons && !!pkp.documentTypeIcons[file?.documentType]
		? pkp.documentTypeIcons[file?.documentType]
		: 'DocumentDefault';
}
</script>

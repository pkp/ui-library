<template>
	<TableCell>
		<div class="flex items-center">
			<Badge v-if="mediaFile.variantType">
				{{ variantTypeLabel }}
			</Badge>
		</div>
	</TableCell>
</template>

<script setup>
import {computed} from 'vue';
import TableCell from '@/components/Table/TableCell.vue';
import Badge from '@/components/Badge/Badge.vue';
import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();

const props = defineProps({mediaFile: {type: Object, required: true}});

const variantTypeLabelMap = {
	web: 'publication.mediaFiles.variantType.web',
	high_resolution: 'publication.mediaFiles.variantType.highResolution',
	multimedia: 'publication.mediaFiles.variantType.multimedia',
};

const variantTypeLabel = computed(() => {
	const key = variantTypeLabelMap[props.mediaFile.variantType];
	return key ? t(key) : props.mediaFile.variantType;
});
</script>

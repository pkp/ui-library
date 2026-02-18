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

const variantTypeLabel = computed(() => {
	if (props.mediaFile.variantType === 'web') {
		return t('publication.mediaFiles.variantType.web');
	} else if (props.mediaFile.variantType === 'high_resolution') {
		return t('publication.mediaFiles.variantType.highResolution');
	} else if (props.mediaFile.variantType === 'multimedia') {
		return t('publication.mediaFiles.variantType.multimedia');
	} else {
		return props.mediaFile.variantType;
	}
});
</script>

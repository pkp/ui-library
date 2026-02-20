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
import {useMediaFileManagerStore} from './mediaFileManagerStore';

const {t, localize} = useLocalize();
const mediaFileManagerStore = useMediaFileManagerStore();

const props = defineProps({mediaFile: {type: Object, required: true}});

const genreName = computed(() => {
	const genre = mediaFileManagerStore.genres?.find(
		(g) => g.id === props.mediaFile.genreId,
	);
	return genre ? localize(genre.name) : '';
});

const variantTypeLabel = computed(() => {
	if (props.mediaFile.variantType === 'high_resolution' && genreName.value) {
		return t('publication.mediaFiles.variantType.highResolution', {
			genreName: genreName.value,
		});
	}
	return genreName.value || props.mediaFile.variantType;
});
</script>

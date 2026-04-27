<template>
	<TableCell>
		<div class="flex items-center gap-2">
			<Badge>
				{{ genreName }}
			</Badge>
			<Badge v-if="isResolutionVariant">
				{{ t('publication.mediaFiles.upload.variantTypeHighRes') }}
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

const isResolutionVariant = computed(
	() =>
		props.mediaFile.variantType ===
		pkp.const.MEDIA_VARIANT_TYPE_HIGH_RESOLUTION,
);
</script>

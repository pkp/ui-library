<template>
	<TableCell no-wrap>
		<div class="flex flex-wrap gap-1">
			<Badge
				v-if="file.genreName"
				:is-primary="!file.genreIsDependent && !file.genreIsSupplementary"
			>
				{{ localize(file.genreName) }}
			</Badge>
			<Badge v-if="hasAmendmentNotice">
				{{ t('submission.files.amendmentNotice') }}
			</Badge>
		</div>
	</TableCell>
</template>
<script setup>
import {computed} from 'vue';
import TableCell from '@/components/Table/TableCell.vue';
import Badge from '@/components/Badge/Badge.vue';

import {useLocalize} from '@/composables/useLocalize';

const {t, localize} = useLocalize();

const props = defineProps({
	file: {type: Object, required: true},
});

const hasAmendmentNotice = computed(() => {
	const reviewRevisionStages = [
		pkp.const.SUBMISSION_FILE_REVIEW_REVISION,
		pkp.const.SUBMISSION_FILE_INTERNAL_REVIEW_REVISION,
	];
	if (!reviewRevisionStages.includes(props.file.fileStage)) {
		return false;
	}

	const summaryOfChanges = props.file.summaryOfChanges;
	if (!summaryOfChanges || typeof summaryOfChanges !== 'object') return false;

	return Object.values(summaryOfChanges).some((value) => !!value);
});
</script>

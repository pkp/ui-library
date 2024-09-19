<template>
	<div class="border border-light p-5">
		<h2 class="text-lg-bold text-heading">{{ texts.heading }}</h2>
		<p v-if="description" class="text-base-normal">{{ texts.description }}</p>
	</div>
</template>

<script setup>
import {computed} from 'vue';
import {useLocalize} from '@/composables/useLocalize';

const props = defineProps({
	submission: {type: Object, required: true},
});

const {t} = useLocalize();

const texts = computed(() => {
	switch (props.submission.stageId) {
		case pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW:
			return {
				heading: t('editor.submission.workflowDecision.submission.underReview'),
			};
		case pkp.const.WORKFLOW_STAGE_ID_EDITING:
			return {heading: 'todo'};
		case pkp.const.WORKFLOW_STAGE_ID_PRODUCTION:
			switch (props.submission.status) {
				case pkp.const.STATUS_QUEUED:
					return {heading: 'todo'};
				case pkp.const.STATUS_SCHEDULED:
					return {heading: 'todo'};
				case pkp.const.STATUS_PUBLISHED:
					return {heading: 'todo'};
				case pkp.const.STATUS_DECLINED:
					return {heading: 'todo'};
			}
	}
	return '';
});
</script>

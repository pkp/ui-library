<template>
	<div class="flex">
		<div class="flex-grow">
			<h2>{{ title }}</h2>
		</div>
		<div class="flex-shrink-0">
			<DropdownActions
				:actions="exportOptions"
				:label="t('editor.review.download')"
			/>
		</div>
	</div>
</template>
<script setup>
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
const props = defineProps({
	title: {type: String, required: true},
	submissionId: {type: Number, required: true},
	reviewRoundId: {type: Number, required: true},
	reviewAssignmentId: {type: Number, required: true},
	submissionStageId: {type: Number, required: true},
});

const {t} = useLocalize();
const exportOptions = [
	{
		label: `${t('editor.review.authorOnly')} (PDF)`,
		url: getUrl('export-p-d-f', 1),
	},
	{
		label: `${t('editor.review.authorOnly')} (XML)`,
		url: getUrl('exportXML', 1),
	},
	{
		label: `${t('editor.review.allSections')} (PDF)`,
		url: getUrl('exportPDF', 0),
	},
	{
		label: `${t('editor.review.allSections')} (XML)`,
		url: getUrl('exportPDF', 0),
	},
];

function getUrl(op, authorFriendly) {
	const {url} = useLegacyGridUrl({
		component: 'grid.users.reviewer.ReviewerGridHandler',
		op,
		params: {
			submissionId: props.submissionId,
			reviewAssignmentId: props.reviewAssignmentId,
			stageId: props.submissionStageId,
			reviewRoundId: props.reviewRoundId,
			authorFriendly,
		},
	});

	return url.value;
}
</script>

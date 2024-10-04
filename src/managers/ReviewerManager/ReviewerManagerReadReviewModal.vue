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
import {useApiUrl} from '@/composables/useApiUrl';
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
		url: getUrl('export-pdf', 1),
	},
	{
		label: `${t('editor.review.authorOnly')} (XML)`,
		url: getUrl('export-xml', 1),
	},
	{
		label: `${t('editor.review.allSections')} (PDF)`,
		url: getUrl('export-pdf', 0),
	},
	{
		label: `${t('editor.review.allSections')} (XML)`,
		url: getUrl('export-xml', 0),
	},
];

function getUrl(op, authorFriendly) {
	const {apiUrl} = useApiUrl(
		`reviews/${props.submissionId}/${props.reviewAssignmentId}/${op}?authorFriendly=${authorFriendly}`,
	);

	return apiUrl.value;
}
</script>

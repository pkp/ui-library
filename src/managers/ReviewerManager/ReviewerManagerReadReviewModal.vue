<template>
	<div class="flex">
		<div class="flex-grow">
			<h2>{{ title }}</h2>
		</div>
		<div class="flex-shrink-0">
			<DropdownActions
				:actions="exportOptions"
				:label="t('editor.review.download')"
				@action="handleExport"
			/>
		</div>
	</div>
</template>
<script setup>
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useApiUrl} from '@/composables/useApiUrl';
import {useFetch} from '@/composables/useFetch';
const props = defineProps({
	title: {type: String, required: true},
	submissionId: {type: String, required: true},
	reviewRoundId: {type: String, required: true},
	reviewAssignmentId: {type: String, required: true},
	submissionStageId: {type: String, required: true},
});

const {t} = useLocalize();
const exportOptions = [
	{
		label: `${t('editor.review.authorOnly')} (PDF)`,
		name: 'authorPdf',
	},
	{
		label: `${t('editor.review.authorOnly')} (XML)`,
		name: 'authorXml',
	},
	{
		label: `${t('editor.review.allSections')} (PDF)`,
		name: 'editorPdf',
	},
	{
		label: `${t('editor.review.allSections')} (XML)`,
		name: 'editorXml',
	},
];

async function handleExport(name) {
	let op;
	let authorFriendly;
	switch (name) {
		case 'authorPdf':
			op = 'export-pdf';
			authorFriendly = 1;
			break;
		case 'authorXml':
			op = 'export-xml';
			authorFriendly = 1;
			break;
		case 'editorPdf':
			op = 'export-pdf';
			authorFriendly = 0;
			break;
		case 'editorXml':
			op = 'export-xml';
			authorFriendly = 0;
			break;
	}

	const {apiUrl} = useApiUrl(
		`reviews/${props.submissionId}/${props.reviewAssignmentId}/${op}?authorFriendly=${authorFriendly}`,
	);

	const {data, fetch, isSuccess, validationError} = useFetch(apiUrl, {
		method: 'GET',
		expectValidationError: true,
	});
	await fetch();
	if (validationError.value) {
		pkp.eventBus.$emit('notify', validationError.value.error, 'warning');
	} else if (isSuccess.value) {
		const anchor = document.createElement('a');
		anchor.href = useApiUrl(
			`reviews/${props.submissionId}/exports/${data.value.temporaryFileId}`,
		).apiUrl.value;
		document.body.appendChild(anchor);
		anchor.click();
		document.body.removeChild(anchor);
	}
}
</script>

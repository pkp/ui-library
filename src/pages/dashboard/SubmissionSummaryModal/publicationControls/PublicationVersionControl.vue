<template>
	<div class="flex items-center">
		<span class="text-lg-bold">
			{{ t('semicolon', {label: t('submission.versions')}) }}
		</span>
		<span class="ms-1 text-lg-normal">
			{{ submission.publications.length }}
		</span>
		<span class="ms-3">
			<DropdownActions
				v-bind="dropdownActionsProps"
				@action="handleAction"
			></DropdownActions>
		</span>
	</div>
</template>
<script setup>
import {computed} from 'vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useSubmissionSummaryStore} from '../submissionSummaryStore';

const props = defineProps({
	submission: {type: Object, required: true},
	selectedPublicationId: {type: Object, required: true},
});

const {t} = useLocalize();

function getLabel(publication) {
	const firstPart = t('publication.version', {version: publication.version});
	let secondPart = '';
	if (
		publication.status === pkp.const.STATUS_QUEUED &&
		props.submission.currentPublicationId === publication.id
	) {
		secondPart = t('publication.status.unscheduled');
	} else if (publication.status === pkp.const.STATUS_SCHEDULED) {
		secondPart = t('publication.status.scheduled');
	} else if (publication.status === pkp.const.STATUS_PUBLISHED) {
		secondPart = publication.datePublished;
	} else {
		secondPart = t('publication.status.unpublished');
	}

	return `${t('semicolon', {label: firstPart})} ${secondPart}`;
}

const dropdownActionsProps = computed(() => {
	const selectedPublication = props.submission.publications.find(
		(publication) => publication.id === props.selectedPublicationId,
	);

	const actions = props.submission.publications.map((publication) => ({
		label: getLabel(publication),
		name: publication.id,
	}));
	return {label: getLabel(selectedPublication), actions};
});

const summaryStore = useSubmissionSummaryStore();

function handleAction(publicationId) {
	summaryStore.selectPublicationId(publicationId);
}
</script>

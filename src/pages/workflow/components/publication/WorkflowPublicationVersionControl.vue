<template>
	<div class="flex items-center">
		<span class="text-lg-bold">
			{{ t('semicolon', {label: t('common.status')}) }}
		</span>
		<span
			class="ms-2 h-[1em] w-[1em] rounded-full"
			:class="statusProps.color"
			aria-hidden="true"
		/>
		<span class="ms-1 text-base-normal">{{ statusProps.label }}</span>
		<span class="ms-6 text-lg-bold">
			{{ t('semicolon', {label: t('admin.version')}) }}
		</span>
		<span class="ms-2 text-base-normal">
			{{ selectedPublication.version }}
		</span>
		<span class="ms-2">
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
import {useWorkflowStore} from '@/pages/workflow/workflowStore';

const props = defineProps({
	submission: {type: Object, required: true},
	selectedPublicationId: {type: Object, required: true},
});

const {t} = useLocalize();

const selectedPublication = computed(() =>
	props.submission.publications.find(
		(publication) => publication.id === props.selectedPublicationId,
	),
);

const statusProps = computed(() => {
	const publication = selectedPublication.value;
	if (
		publication.status === pkp.const.STATUS_QUEUED &&
		publication.id === props.submission.currentPublicationId
	) {
		return {
			label: t('publication.status.unscheduled'),
			color: 'bg-stage-declined',
		};
	} else if (publication.status === pkp.const.STATUS_SCHEDULED) {
		return {
			label: t('publication.status.scheduled'),
			color: 'bg-stage-scheduled-for-publishing',
		};
	} else if (publication.status === pkp.const.STATUS_PUBLISHED) {
		return {
			label: t('publication.status.published'),
			color: 'bg-stage-published',
		};
	} else {
		return {
			label: t('publication.status.unpublished'),
			color: 'bg-stage-declined',
		};
	}
});

function getItemLabel(publication) {
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
	const actions = props.submission.publications.map((publication) => ({
		label: getItemLabel(publication),
		name: publication.id,
	}));
	return {label: t('publication.version.all'), actions};
});

const workflowStore = useWorkflowStore();

function handleAction(publicationId) {
	workflowStore.selectPublicationId(publicationId);
}
</script>

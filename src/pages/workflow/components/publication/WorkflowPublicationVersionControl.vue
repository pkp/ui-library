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
	</div>
</template>
<script setup>
import {computed} from 'vue';
import {useLocalize} from '@/composables/useLocalize';

const props = defineProps({
	submission: {type: Object, required: true},
	selectedPublicationId: {type: Number, required: true},
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
</script>

<template>
	<div class="mb-4 space-x-2">
		<span class="bg-medium text-lg-normal">
			{{ t('reviewer.submission.reviewRound.info') }}
		</span>
		<PkpButton
			v-for="review in store.reviewRoundHistories"
			:key="review.reviewRoundId"
			@click="store.openRoundHistoryModal(review)"
		>
			{{ t('submission.round', {round: review.reviewRoundNumber}) }}
		</PkpButton>
	</div>
	<SideModal
		:open="store.isRoundHistoryModalOpened"
		@close="store.closeRoundHistoryModal"
	>
		<RoundHistoryModal
			v-bind="store.roundHistoryModalProps"
		></RoundHistoryModal>
	</SideModal>
</template>

<script setup>
import {defineProps} from 'vue';

import SideModal from '@/components/Modal/SideModal.vue';
import RoundHistoryModal from './RoundHistoryModal.vue';

import {useTranslation} from '@/composables/useTranslation';

import {useReviewerSubmissionPageStore} from './reviewerSubmissionPageStore';

const {t} = useTranslation();

const props = defineProps({
	reviewRoundHistories: {
		type: Object,
		required: true,
	},
});

const store = useReviewerSubmissionPageStore(props);
</script>

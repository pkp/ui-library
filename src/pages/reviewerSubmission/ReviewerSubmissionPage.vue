<template>
	<div class="panel p-8 mb-4">
		<h2>{{ t('reviewer.submission.reviewRound.info') }}</h2>
		<p
			v-for="review in store.reviewRoundHistories"
			:key="review.reviewRoundId"
		>
			<span class="text-lg-normal">
				{{ t(
					'reviewer.submission.reviewRound.info.submittedOn',
					{round: review.reviewRoundNumber, submittedOn: formatShortDate(review.submittedOn)}
				) }}
			</span>
			<PkpButton
				is-link="true"
				class="ml-4"
				@click="store.openRoundHistoryModal(review)"
			>
				{{ t('reviewer.submission.reviewRound.info.read', {round: review.reviewRoundNumber}) }}
			</PkpButton>
		</p>
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
import moment from 'moment';

function formatShortDate(dateString) {
	return moment(dateString).format('DD-MM-YYYY');
}

const {t} = useTranslation();

const props = defineProps({
	reviewRoundHistories: {
		type: Object,
		required: true,
	},
});

const store = useReviewerSubmissionPageStore(props);
</script>

<template>
	<div class="mb-4 border border-light bg-secondary p-6 text-base-normal">
		<h2 class="text-lg-bold text-heading">
			{{ t('reviewer.submission.reviewRound.info') }}
		</h2>
		<p v-for="review in store.reviewRoundHistories" :key="review.reviewRoundId">
			<span>
				{{
					t('reviewer.submission.reviewRound.info.submittedOn', {
						round: review.reviewRoundNumber,
						submittedOn: formatShortDate(review.submittedOn),
					})
				}}
			</span>
			<PkpButton
				is-link="true"
				class="ms-4"
				@click="store.openRoundHistoryModal(review)"
			>
				{{
					t('reviewer.submission.reviewRound.info.read', {
						round: review.reviewRoundNumber,
					})
				}}
			</PkpButton>
		</p>
	</div>
</template>

<script setup>
import {defineProps} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useReviewerSubmissionPageStore} from './reviewerSubmissionPageStore';
import {useDate} from '@/composables/useDate';

const {formatShortDate} = useDate();

const {t} = useLocalize();

const props = defineProps({
	reviewRoundHistories: {
		type: Object,
		required: true,
	},
});

const store = useReviewerSubmissionPageStore(props);
</script>

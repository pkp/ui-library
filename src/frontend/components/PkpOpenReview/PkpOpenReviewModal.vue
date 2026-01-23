<template>
	<div class="pkpOpenReviewModal">
		<slot
			name="modalHeader"
			:current-review="currentReview"
			:has-prev="hasPrev"
			:has-next="hasNext"
			:navigate-prev="store.navigatePrev"
			:navigate-next="store.navigateNext"
		>
			<header class="pkpOpenReviewModal__header">
				<h2 class="pkpOpenReviewModal__title">
					{{ t('openReview.fullReview') }}
				</h2>
				<div class="pkpOpenReviewModal__nav">
					<button
						class="pkpOpenReviewModal__nav-btn"
						:disabled="!hasPrev"
						:aria-label="t('common.pagination.previous')"
						@click="store.navigatePrev()"
					>
						‹
					</button>
					<button
						class="pkpOpenReviewModal__nav-btn"
						:disabled="!hasNext"
						:aria-label="t('common.pagination.next')"
						@click="store.navigateNext()"
					>
						›
					</button>
				</div>
			</header>
		</slot>

		<div v-if="currentReview" class="pkpOpenReviewModal__meta">
			<slot name="modalMeta" :review="currentReview">
				<div class="pkpOpenReviewModal__reviewer">
					<PkpIcon
						:icon="currentReview.reviewerRecommendationTypeIcon"
						class="pkpOpenReviewModal__recommendation-icon"
						:data-recommendation="currentReview.reviewerRecommendationTypeCss"
					/>
					{{ currentReview.reviewerFullName }}
				</div>
				<div class="pkpOpenReviewModal__affiliation">
					{{ currentReview.reviewerAffiliation }}
				</div>
				<div class="pkpOpenReviewModal__version">
					{{ currentReview.round.displayText }} •
					{{ formatShortDate(currentReview.dateCompleted) }}
				</div>
			</slot>
		</div>

		<div v-if="currentReview" class="pkpOpenReviewModal__content">
			<!-- Review comments (plain text reviews) -->
			<template v-if="currentReview.reviewerComments?.length">
				<p
					v-for="(comment, i) in currentReview.reviewerComments"
					:key="i"
					class="pkpOpenReviewModal__comment"
				>
					{{ comment }}
				</p>
			</template>

			<!-- Review form responses -->
			<template v-else-if="currentReview.reviewForm">
				<div
					v-for="(question, i) in currentReview.reviewForm.questions"
					:key="i"
					class="pkpOpenReviewModal__form-question"
				>
					<strong>{{ question.question }}</strong>
					<p v-for="(response, j) in question.responses" :key="j">
						{{ response }}
					</p>
				</div>
			</template>

			<!-- No content available -->
			<template v-else>
				<p class="pkpOpenReviewModal__no-content">
					{{ t('openReview.noCommentsAvailable') }}
				</p>
			</template>
		</div>
	</div>
</template>

<script setup>
import {storeToRefs} from 'pinia';
import {usePkpOpenReviewStore} from './usePkpOpenReviewStore';
import {usePkpDate} from '@/frontend/composables/usePkpDate';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';

const store = usePkpOpenReviewStore();
const {currentReview, hasPrev, hasNext} = storeToRefs(store);
const {formatShortDate} = usePkpDate();
const {t} = usePkpLocalize();
</script>

<style>
/* Style the dialog container when it contains this modal */
.BaseDialogContent:has(.pkpOpenReviewModal) {
	width: 80vw;
	max-width: 800px;
}

.pkpOpenReviewModal {
	display: flex;
	flex-direction: column;
}

.pkpOpenReviewModal__header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1rem;
}

.pkpOpenReviewModal__title {
	font-size: 1.25rem;
	font-weight: 600;
	margin: 0;
	color: #1a1a1a;
}

.pkpOpenReviewModal__nav {
	display: flex;
	gap: 0.5rem;
}

.pkpOpenReviewModal__nav-btn {
	width: 2.5rem;
	height: 2.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #fff;
	border: 1px solid #d1d5db;
	border-radius: 0.375rem;
	font-size: 1.25rem;
	color: #374151;
	cursor: pointer;
}

.pkpOpenReviewModal__nav-btn:hover:not(:disabled) {
	background: #f3f4f6;
}

.pkpOpenReviewModal__nav-btn:disabled {
	opacity: 0.4;
	cursor: not-allowed;
}

.pkpOpenReviewModal__meta {
	margin-bottom: 1.5rem;
}

.pkpOpenReviewModal__reviewer {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-weight: 600;
	font-size: 1rem;
	color: #1a1a1a;
	margin-bottom: 0.25rem;
}

.pkpOpenReviewModal__recommendation-icon {
	width: 1.25rem;
	height: 1.25rem;
}

.pkpOpenReviewModal__recommendation-icon[data-recommendation='approved'] {
	color: #0d6d3d;
}

.pkpOpenReviewModal__recommendation-icon[data-recommendation='revisions_requested'] {
	color: #b45309;
}

.pkpOpenReviewModal__recommendation-icon[data-recommendation='not_approved'] {
	color: #dc2626;
}

.pkpOpenReviewModal__recommendation-icon[data-recommendation='with_comments'] {
	color: #2563eb;
}

.pkpOpenReviewModal__affiliation {
	font-size: 0.875rem;
	color: #666;
	margin-bottom: 0.25rem;
}

.pkpOpenReviewModal__version {
	font-size: 0.875rem;
	color: #666;
}

.pkpOpenReviewModal__content {
	max-height: 60vh;
	overflow-y: auto;
	line-height: 1.6;
}

.pkpOpenReviewModal__comment {
	margin: 0 0 1rem;
	color: #374151;
}

.pkpOpenReviewModal__comment:last-child {
	margin-bottom: 0;
}

.pkpOpenReviewModal__form-question {
	margin-bottom: 1.5rem;
}

.pkpOpenReviewModal__form-question:last-child {
	margin-bottom: 0;
}

.pkpOpenReviewModal__form-question strong {
	display: block;
	margin-bottom: 0.5rem;
	color: #1a1a1a;
}

.pkpOpenReviewModal__form-question p {
	margin: 0 0 0.5rem;
	color: #374151;
}

.pkpOpenReviewModal__no-content {
	color: #666;
	font-style: italic;
}
</style>

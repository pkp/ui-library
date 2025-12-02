<template>
	<BaseOpenReviewRounds
		v-slot="{round, summary}"
		:rounds="reviews.reviewRounds"
	>
		<BaseOpenReviewRound :round="round">
			<BaseOpenReviewRoundHeader>
				<div class="BaseOpenReviewRoundHeaderMain">
					<span class="BaseOpenReviewRoundHeaderTitle">
						{{ round.displayText }}
					</span>
					<span class="BaseOpenReviewRoundHeaderCount">
						({{ round.reviews.length }} Reviewers)
					</span>
				</div>
				<div class="BaseOpenReviewRoundHeaderSummary">
					<span
						v-for="item in summary"
						:key="item.recommendation"
						class="BaseOpenReviewRoundHeaderSummaryBadge"
						:class="`BaseOpenReviewRoundHeaderSummaryBadge--${item.recommendation}`"
					>
						<PkpIcon :icon="item.recommendation" />
						{{ item.count }} {{ summaryLabels[item.recommendation] }}
					</span>
				</div>
			</BaseOpenReviewRoundHeader>
			<BaseOpenReviewRoundContent>
				<BaseOpenReviewRoundReviews v-slot="{review}">
					<BaseOpenReviewRoundReview :review="review">
						<span class="BaseOpenReviewRoundReviewStatus">
							<PkpIcon :icon="review.recommendation" />
							{{ review.reviewerRecommendationDisplayText }}
						</span>
						<span class="BaseOpenReviewRoundReviewerName">
							{{ review.reviewerFullName }}
						</span>
						<span class="BaseOpenReviewRoundReviewerAffiliation">
							— {{ review.reviewerAffiliation }}
						</span>
						<button class="BaseOpenReviewRoundReviewReadBtn">
							Read Review
						</button>
					</BaseOpenReviewRoundReview>
				</BaseOpenReviewRoundReviews>
			</BaseOpenReviewRoundContent>
		</BaseOpenReviewRound>
	</BaseOpenReviewRounds>
</template>
<script setup>
import BaseOpenReviewRounds from './base/BaseOpenReviewRounds.vue';
import BaseOpenReviewRound from './base/BaseOpenReviewRound.vue';
import BaseOpenReviewRoundHeader from './base/BaseOpenReviewRoundHeader.vue';
import BaseOpenReviewRoundContent from './base/BaseOpenReviewRoundContent.vue';
import BaseOpenReviewRoundReviews from './base/BaseOpenReviewRoundReviews.vue';
import BaseOpenReviewRoundReview from './base/BaseOpenReviewRoundReview.vue';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';

defineProps({
	reviews: {type: Object, required: true},
});

const summaryLabels = {
	approved: 'Approved',
	revisions_requested: 'Revisions Requested',
	not_approved: 'Not Approved',
	comments: 'Comments',
};
</script>

<style>
/* Rounds container (AccordionRoot) */
.BaseOpenReviewRounds {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

/* Single round (AccordionItem) */
.BaseOpenReviewRound {
	border: 1px solid #e0e0e0;
	border-radius: 0.5rem;
	background: #fff;
	overflow: hidden;
}

/* Round header (AccordionHeader + Trigger) */
.BaseOpenReviewRoundHeader {
	width: 100%;
	margin: 0;
}

.BaseOpenReviewRoundHeaderTrigger {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	padding: 1rem 1.25rem;
	background: #fff;
	border: none;
	cursor: pointer;
	text-align: left;
}

.BaseOpenReviewRoundHeaderTrigger:hover {
	background: #f8f9fa;
}

/* Chevron rotation when open */
.BaseOpenReviewRoundHeaderTrigger[data-state='open']
	.BaseOpenReviewRoundHeaderChevron {
	transform: rotate(180deg);
}

/* Round header main line */
.BaseOpenReviewRoundHeaderMain {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.BaseOpenReviewRoundHeaderTitle {
	font-weight: 600;
	font-size: 1rem;
	color: #1a1a1a;
	text-decoration: underline;
}

.BaseOpenReviewRoundHeaderCount {
	font-size: 0.875rem;
	color: #666;
}

/* Summary badges row */
.BaseOpenReviewRoundHeaderSummary {
	display: flex;
	gap: 1rem;
	margin-top: 0.25rem;
}

.BaseOpenReviewRoundHeaderSummaryBadge {
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	font-size: 0.8125rem;
}

.BaseOpenReviewRoundHeaderSummaryBadge .BaseIcon {
	width: 1rem;
	height: 1rem;
}

.BaseOpenReviewRoundHeaderSummaryBadge--approved {
	color: #0d6d3d;
}

.BaseOpenReviewRoundHeaderSummaryBadge--revisions_requested {
	color: #b45309;
}

.BaseOpenReviewRoundHeaderSummaryBadge--not_approved {
	color: #dc2626;
}

.BaseOpenReviewRoundHeaderSummaryBadge--comments {
	color: #2563eb;
}

/* Round content (AccordionContent) */
.BaseOpenReviewRoundContent {
	padding: 0 1.25rem 1.25rem 1.25rem;
}

/* Reviews list */
.BaseOpenReviewRoundReviews {
	list-style: none;
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: column;
}

/* Single review item */
.BaseOpenReviewRoundReview {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.875rem 0;
	border-top: 1px solid #e5e7eb;
}

.BaseOpenReviewRoundReview:first-child {
	border-top: none;
}

/* Review status badge */
.BaseOpenReviewRoundReviewStatus {
	display: inline-flex;
	align-items: center;
	gap: 0.375rem;
	font-size: 0.8125rem;
	padding-right: 0.75rem;
	border-right: 1px solid #e5e7eb;
	white-space: nowrap;
}

.BaseOpenReviewRoundReviewStatus .BaseIcon {
	width: 1.125rem;
	height: 1.125rem;
}

/* Status colors based on recommendation */
.BaseOpenReviewRoundReview[data-recommendation='approved']
	.BaseOpenReviewRoundReviewStatus {
	color: #0d6d3d;
}

.BaseOpenReviewRoundReview[data-recommendation='revisions_requested']
	.BaseOpenReviewRoundReviewStatus {
	color: #b45309;
}

.BaseOpenReviewRoundReview[data-recommendation='not_approved']
	.BaseOpenReviewRoundReviewStatus {
	color: #dc2626;
}

.BaseOpenReviewRoundReview[data-recommendation='comments']
	.BaseOpenReviewRoundReviewStatus {
	color: #2563eb;
}

/* Reviewer name */
.BaseOpenReviewRoundReviewerName {
	font-weight: 600;
	font-size: 0.9375rem;
	color: #1a1a1a;
}

/* Reviewer affiliation */
.BaseOpenReviewRoundReviewerAffiliation {
	flex: 1;
	font-size: 0.875rem;
	color: #666;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

/* Read Review button */
.BaseOpenReviewRoundReviewReadBtn {
	display: inline-flex;
	align-items: center;
	gap: 0.375rem;
	padding: 0.5rem 1rem;
	background: #fff;
	border: 1px solid #1a56db;
	border-radius: 0.375rem;
	font-size: 0.875rem;
	font-weight: 500;
	color: #1a56db;
	cursor: pointer;
	white-space: nowrap;
	margin-left: auto;
}

.BaseOpenReviewRoundReviewReadBtn:hover {
	background: #1a56db;
	color: #fff;
}
</style>

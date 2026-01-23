<template>
	<section class="pkpOpenReviewSummary">
		<!-- Header -->
		<h2 class="pkpOpenReviewSummary__heading">
			{{ t('openReview.title') }}
		</h2>

		<!-- Status (mocked for now) -->
		<div class="pkpOpenReviewSummary__status">
			<span class="pkpOpenReviewSummary__badge">In Progress</span>
			<span class="pkpOpenReviewSummary__since">Open since Dec 12, 2025</span>
		</div>

		<!-- Reviewer Count -->
		<p class="pkpOpenReviewSummary__reviewerCount">
			<strong>{{ summary?.reviewerCount ?? 0 }}</strong>
			{{ t('openReview.reviewersContributed') }}
		</p>

		<!-- Recommendations -->
		<div class="pkpOpenReviewSummary__recommendations">
			<div
				v-for="rec in summary?.reviewerRecommendations"
				:key="rec.recommendationTypeId"
				class="pkpOpenReviewSummary__recommendation"
				:data-recommendation="
					store.getRecommendationTypeInfo(rec.recommendationTypeId)?.cssClass
				"
			>
				<PkpIcon
					:icon="
						store.getRecommendationTypeInfo(rec.recommendationTypeId)?.iconName
					"
					aria-hidden="true"
				/>
				<span class="pkpOpenReviewSummary__recommendationLabel">
					{{ rec.recommendationTypeLabel }}
				</span>
				<span class="pkpOpenReviewSummary__recommendationCount">
					{{ rec.count }}
				</span>
			</div>
		</div>

		<!-- How decisions summarized -->
		<details class="pkpOpenReviewSummary__details">
			<summary>{{ t('openReview.howDecisionsSummarized') }}</summary>
			<p>{{ t('openReview.howDecisionsSummarizedDescription') }}</p>
		</details>

		<!-- Versions Info -->
		<p class="pkpOpenReviewSummary__versions">
			{{
				t('openReview.versionsPublished', {
					count: summary?.submissionPublishedVersionsCount ?? 0,
				})
			}}
		</p>

		<!-- Current Version -->
		<p
			v-if="summary?.submissionCurrentVersion"
			class="pkpOpenReviewSummary__currentVersion"
		>
			<strong>{{ t('openReview.currentVersion') }}</strong>
			{{ summary.submissionCurrentVersion.title }}
			({{ formatShortDate(summary.submissionCurrentVersion.datePublished) }})
		</p>

		<!-- Review Model -->
		<p class="pkpOpenReviewSummary__reviewModel">
			<strong>{{ t('openReview.reviewModel') }}</strong>
			Double-blind peer review
		</p>

		<!-- Button -->
		<PkpButton
			class="pkpOpenReviewSummary__button"
			@click="store.viewFullRecord"
		>
			{{ t('openReview.seeFullRecord') }} →
		</PkpButton>
	</section>
</template>

<script setup>
import {computed} from 'vue';
import {usePkpOpenReviewStore} from './usePkpOpenReviewStore';
import PkpButton from '@/frontend/components/PkpButton/PkpButton.vue';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpDate} from '@/frontend/composables/usePkpDate';

const props = defineProps({
	publicationsPeerReviews: {type: Array, required: true},
	submissionPeerReviewSummary: {type: Object, required: true},
});

const store = usePkpOpenReviewStore();
store.initialize({
	publicationsPeerReviews: props.publicationsPeerReviews,
	submissionPeerReviewSummary: props.submissionPeerReviewSummary,
});

const summary = computed(() => store.submissionSummary);

const {t} = usePkpLocalize();
const {formatShortDate} = usePkpDate();
</script>

<style>
.pkpOpenReviewSummary {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding: 1.5rem;
	background: #fff;
	border: 1px solid #e0e0e0;
	border-radius: 0.5rem;
}

.pkpOpenReviewSummary__heading {
	font-size: 1.25rem;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0;
}

.pkpOpenReviewSummary__status {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.pkpOpenReviewSummary__badge {
	display: inline-block;
	padding: 0.25rem 0.75rem;
	font-size: 0.8125rem;
	font-weight: 500;
	color: #0d6d3d;
	background: #d1fae5;
	border-radius: 9999px;
}

.pkpOpenReviewSummary__since {
	font-size: 0.875rem;
	color: #666;
}

.pkpOpenReviewSummary__reviewerCount {
	font-size: 0.9375rem;
	color: #1a1a1a;
	margin: 0;
}

.pkpOpenReviewSummary__recommendations {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.pkpOpenReviewSummary__recommendation {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.875rem;
}

.pkpOpenReviewSummary__recommendation .PkpIcon {
	width: 1.25rem;
	height: 1.25rem;
	flex-shrink: 0;
}

.pkpOpenReviewSummary__recommendation[data-recommendation='approved'] .PkpIcon {
	color: #0d6d3d;
}

.pkpOpenReviewSummary__recommendation[data-recommendation='revisions_requested']
	.PkpIcon {
	color: #b45309;
}

.pkpOpenReviewSummary__recommendation[data-recommendation='not_approved']
	.PkpIcon {
	color: #dc2626;
}

.pkpOpenReviewSummary__recommendation[data-recommendation='with_comments']
	.PkpIcon {
	color: #2563eb;
}

.pkpOpenReviewSummary__recommendationLabel {
	color: #374151;
}

.pkpOpenReviewSummary__recommendationCount {
	font-weight: 600;
	color: #1a1a1a;
}

.pkpOpenReviewSummary__details {
	font-size: 0.875rem;
	color: #374151;
}

.pkpOpenReviewSummary__details summary {
	cursor: pointer;
	color: #2563eb;
	font-weight: 500;
	list-style: none;
}

.pkpOpenReviewSummary__details summary::marker,
.pkpOpenReviewSummary__details summary::-webkit-details-marker {
	display: none;
}

.pkpOpenReviewSummary__details summary:hover {
	text-decoration: underline;
}

.pkpOpenReviewSummary__details p {
	margin: 0.5rem 0 0 0;
	color: #666;
	line-height: 1.5;
}

.pkpOpenReviewSummary__versions {
	font-size: 0.9375rem;
	color: #1a1a1a;
	margin: 0;
}

.pkpOpenReviewSummary__currentVersion {
	font-size: 0.875rem;
	color: #374151;
	margin: 0;
}

.pkpOpenReviewSummary__reviewModel {
	font-size: 0.875rem;
	color: #374151;
	margin: 0;
}

.pkpOpenReviewSummary__button {
	align-self: flex-start;
	margin-top: 0.5rem;
}
</style>

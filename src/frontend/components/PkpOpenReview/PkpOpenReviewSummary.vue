<template>
	<section :class="cn('root')">
		<!-- Header -->
		<h2 :class="cn('heading')">
			{{ t('openReview.title') }}
		</h2>

		<!-- Status (mocked for now) -->
		<div :class="cn('status')">
			<span :class="cn('badge')">In Progress</span>
			<span :class="cn('since')">Open since Dec 12, 2025</span>
		</div>

		<!-- Reviewer Count -->
		<p :class="cn('reviewerCount')">
			<strong>{{ summary?.reviewerCount ?? 0 }}</strong>
			{{ t('openReview.reviewersContributed') }}
		</p>

		<!-- Recommendations -->
		<div :class="cn('recommendations')">
			<div
				v-for="rec in summary?.reviewerRecommendations"
				:key="rec.recommendationTypeId"
				:class="cn('recommendation')"
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
				<span :class="cn('recommendationLabel')">
					{{ rec.recommendationTypeLabel }}
				</span>
				<span :class="cn('recommendationCount')">
					{{ rec.count }}
				</span>
			</div>
		</div>

		<!-- How decisions summarized -->
		<details :class="cn('details')">
			<summary>{{ t('openReview.howDecisionsSummarized') }}</summary>
			<p>{{ t('openReview.howDecisionsSummarizedDescription') }}</p>
		</details>

		<!-- Versions Info -->
		<p :class="cn('versions')">
			{{
				t('openReview.versionsPublished', {
					count: summary?.submissionPublishedVersionsCount ?? 0,
				})
			}}
		</p>

		<!-- Current Version -->
		<p v-if="summary?.submissionCurrentVersion" :class="cn('currentVersion')">
			<strong>{{ t('openReview.currentVersion') }}</strong>
			{{ summary.submissionCurrentVersion.title }}
			({{ formatShortDate(summary.submissionCurrentVersion.datePublished) }})
		</p>

		<!-- Review Model -->
		<p :class="cn('reviewModel')">
			<strong>{{ t('openReview.reviewModel') }}</strong>
			Double-blind peer review
		</p>

		<!-- Button -->
		<PkpButton :class="cn('button')" @click="store.viewFullRecord">
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
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	publicationsPeerReviews: {type: Array, required: true},
	submissionPeerReviewSummary: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles(props.styles);

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
.PkpOpenReviewSummary {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding: 1.5rem;
	background: #fff;
	border: 1px solid #e0e0e0;
	border-radius: 0.5rem;
}

.PkpOpenReviewSummary__heading {
	font-size: 1.25rem;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0;
}

.PkpOpenReviewSummary__status {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.PkpOpenReviewSummary__badge {
	display: inline-block;
	padding: 0.25rem 0.75rem;
	font-size: 0.8125rem;
	font-weight: 500;
	color: #0d6d3d;
	background: #d1fae5;
	border-radius: 9999px;
}

.PkpOpenReviewSummary__since {
	font-size: 0.875rem;
	color: #666;
}

.PkpOpenReviewSummary__reviewerCount {
	font-size: 0.9375rem;
	color: #1a1a1a;
	margin: 0;
}

.PkpOpenReviewSummary__recommendations {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.PkpOpenReviewSummary__recommendation {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.875rem;
}

.PkpOpenReviewSummary__recommendation .PkpIcon {
	width: 1.25rem;
	height: 1.25rem;
	flex-shrink: 0;
}

.PkpOpenReviewSummary__recommendation[data-recommendation='approved'] .PkpIcon {
	color: #0d6d3d;
}

.PkpOpenReviewSummary__recommendation[data-recommendation='revisions_requested']
	.PkpIcon {
	color: #b45309;
}

.PkpOpenReviewSummary__recommendation[data-recommendation='not_approved']
	.PkpIcon {
	color: #dc2626;
}

.PkpOpenReviewSummary__recommendation[data-recommendation='with_comments']
	.PkpIcon {
	color: #2563eb;
}

.PkpOpenReviewSummary__recommendationLabel {
	color: #374151;
}

.PkpOpenReviewSummary__recommendationCount {
	font-weight: 600;
	color: #1a1a1a;
}

.PkpOpenReviewSummary__details {
	font-size: 0.875rem;
	color: #374151;
}

.PkpOpenReviewSummary__details summary {
	cursor: pointer;
	color: #2563eb;
	font-weight: 500;
	list-style: none;
}

.PkpOpenReviewSummary__details summary::marker,
.PkpOpenReviewSummary__details summary::-webkit-details-marker {
	display: none;
}

.PkpOpenReviewSummary__details summary:hover {
	text-decoration: underline;
}

.PkpOpenReviewSummary__details p {
	margin: 0.5rem 0 0 0;
	color: #666;
	line-height: 1.5;
}

.PkpOpenReviewSummary__versions {
	font-size: 0.9375rem;
	color: #1a1a1a;
	margin: 0;
}

.PkpOpenReviewSummary__currentVersion {
	font-size: 0.875rem;
	color: #374151;
	margin: 0;
}

.PkpOpenReviewSummary__reviewModel {
	font-size: 0.875rem;
	color: #374151;
	margin: 0;
}

.PkpOpenReviewSummary__button {
	align-self: flex-start;
	margin-top: 0.5rem;
}
</style>

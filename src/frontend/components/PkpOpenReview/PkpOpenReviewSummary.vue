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

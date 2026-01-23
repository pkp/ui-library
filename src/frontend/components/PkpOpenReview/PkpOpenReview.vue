<template>
	<div class="pkpOpenReview">
		<PkpTabRoot default-value="byRecord">
			<header class="pkpOpenReview__tabs-header">
				<span class="pkpOpenReview__tabs-label">
					{{ t('openReview.sortBy') }}
				</span>
				<PkpTabList class="pkpOpenReview__tabs-list">
					<PkpTabTrigger value="byRecord">
						{{ t('publication.versionStage.versionOfRecord') }}
					</PkpTabTrigger>
					<PkpTabTrigger value="byReviewer">
						{{ t('openReview.sortByReviewerName') }}
					</PkpTabTrigger>
				</PkpTabList>
			</header>

			<!-- By Record View -->
			<PkpTabContent value="byRecord">
				<h2 class="pkpOpenReview__heading">
					{{ t('openReview.reportsByRecord') }}
				</h2>
				<PkpAccordionRoot :default-value="store.reviewRounds[0]?.roundId">
					<PkpAccordionItem
						v-for="round in store.reviewRounds"
						:key="round.roundId"
						:value="round.roundId"
						class="pkpOpenReview__accordion-item"
					>
						<PkpAccordionHeader>
							<slot
								name="roundHeader"
								:round="round"
								:summary="store.getRoundSummary(round)"
								:review-count="round.reviews?.length || 0"
							>
								<div class="pkpOpenReview__header">
									<span class="pkpOpenReview__title">
										{{ round.displayText }}
										<template v-if="round.date">
											• {{ formatShortDate(round.date) }}
										</template>
									</span>
									<p>
										({{
											t('openReview.reviewerCount', {
												count: round.reviews?.length || 0,
											})
										}})
									</p>
									<div class="pkpOpenReview__summary">
										<span
											v-for="item in store.getRoundSummary(round)"
											:key="item.typeCss"
											class="pkpOpenReview__summary-item"
											:data-recommendation="item.typeCss"
										>
											<PkpIcon :icon="item.typeIcon" aria-hidden="true" />
											{{ item.count }} {{ item.label }}
										</span>
									</div>
								</div>
							</slot>
						</PkpAccordionHeader>
						<PkpAccordionContent class="pkpOpenReview__accordion-content">
							<ul class="pkpOpenReview__list">
								<li v-for="review in round.reviews" :key="review.reviewId">
									<slot
										name="reviewItem"
										:review="review"
										:round="round"
										:context-reviews="round.reviews"
									>
										<span
											class="pkpOpenReview__status"
											:data-recommendation="
												review.reviewerRecommendationTypeCss
											"
										>
											<PkpIcon
												:icon="review.reviewerRecommendationTypeIcon"
												aria-hidden="true"
											/>
											{{ review.reviewerRecommendationDisplayText }}
										</span>
										<span class="pkpOpenReview__reviewer">
											{{ review.reviewerFullName }}
										</span>
										<span class="pkpOpenReview__affiliation">
											— {{ review.reviewerAffiliation }}
										</span>
										<PkpOpenReviewReadButton
											:review="review"
											:context-reviews="round.reviews"
										/>
									</slot>
								</li>
							</ul>
						</PkpAccordionContent>
					</PkpAccordionItem>
				</PkpAccordionRoot>
			</PkpTabContent>

			<!-- By Reviewer View -->
			<PkpTabContent value="byReviewer">
				<h2 class="pkpOpenReview__heading">
					{{ t('openReview.reportsByReviewer') }}
				</h2>
				<PkpAccordionRoot :default-value="store.reviewerGroups[0]?.reviewerId">
					<PkpAccordionItem
						v-for="reviewer in store.reviewerGroups"
						:key="reviewer.reviewerId"
						:value="reviewer.reviewerId"
						class="pkpOpenReview__accordion-item"
					>
						<PkpAccordionHeader>
							<slot
								name="reviewerHeader"
								:reviewer="reviewer"
								:review-count="reviewer.reviews?.length || 0"
							>
								<div class="pkpOpenReview__header-title">
									<span class="pkpOpenReview__title">
										{{ reviewer.reviewerFullName }}
									</span>
									<p>{{ reviewer.reviewerAffiliation }}</p>
								</div>
								<p class="pkpOpenReview__review-count">
									{{
										t('openReview.reviewCount', {
											count: reviewer.reviews?.length || 0,
										})
									}}
								</p>
							</slot>
						</PkpAccordionHeader>
						<PkpAccordionContent class="pkpOpenReview__accordion-content">
							<ul class="pkpOpenReview__list">
								<li v-for="review in reviewer.reviews" :key="review.reviewId">
									<slot
										name="reviewerItem"
										:review="review"
										:reviewer="reviewer"
										:context-reviews="reviewer.reviews"
									>
										<span
											class="pkpOpenReview__status"
											:data-recommendation="
												review.reviewerRecommendationTypeCss
											"
										>
											<PkpIcon
												:icon="review.reviewerRecommendationTypeIcon"
												aria-hidden="true"
											/>
											{{ review.reviewerRecommendationDisplayText }}
										</span>
										<span class="pkpOpenReview__version">
											{{ review.round.displayText }}
										</span>
										<span class="pkpOpenReview__date">
											— {{ formatShortDate(review.round.date) }}
										</span>
										<PkpOpenReviewReadButton
											:review="review"
											:context-reviews="reviewer.reviews"
										/>
									</slot>
								</li>
							</ul>
						</PkpAccordionContent>
					</PkpAccordionItem>
				</PkpAccordionRoot>
			</PkpTabContent>
		</PkpTabRoot>
	</div>
</template>

<script setup>
import PkpTabRoot from '@/frontend/components/PkpTab/PkpTabRoot.vue';
import PkpTabList from '@/frontend/components/PkpTab/PkpTabList.vue';
import PkpTabTrigger from '@/frontend/components/PkpTab/PkpTabTrigger.vue';
import PkpTabContent from '@/frontend/components/PkpTab/PkpTabContent.vue';
import PkpAccordionRoot from '@/frontend/components/PkpAccordion/PkpAccordionRoot.vue';
import PkpAccordionItem from '@/frontend/components/PkpAccordion/PkpAccordionItem.vue';
import PkpAccordionHeader from '@/frontend/components/PkpAccordion/PkpAccordionHeader.vue';
import PkpAccordionContent from '@/frontend/components/PkpAccordion/PkpAccordionContent.vue';
import PkpOpenReviewReadButton from './base/PkpOpenReviewReadButton.vue';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import {usePkpOpenReviewStore} from './usePkpOpenReviewStore';
import {usePkpDate} from '@/frontend/composables/usePkpDate';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';

const props = defineProps({
	publicationsPeerReviews: {type: Array, required: true},
	submissionPeerReviewSummary: {type: Object, required: true},
});

const store = usePkpOpenReviewStore();
store.initialize({
	publicationsPeerReviews: props.publicationsPeerReviews,
	submissionPeerReviewSummary: props.submissionPeerReviewSummary,
});

const {formatShortDate} = usePkpDate();
const {t} = usePkpLocalize();
</script>

<style>
.pkpOpenReview {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.pkpOpenReview__tabs-header {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding-bottom: 1rem;
	border-bottom: 1px solid #e5e7eb;
}

.pkpOpenReview__tabs-label {
	font-size: 0.875rem;
	color: #666;
}

.pkpOpenReview__tabs-list {
	display: flex;
	background: #f3f4f6;
	border-radius: 0.375rem;
	padding: 0.25rem;
}

.pkpOpenReview__tabs-list .PkpTabTrigger {
	padding: 0.5rem 1rem;
	font-size: 0.875rem;
	font-weight: 500;
	background: transparent;
	border: none;
	border-radius: 0.25rem;
	cursor: pointer;
	color: #374151;
}

.pkpOpenReview__tabs-list .PkpTabTrigger:hover {
	background: #e5e7eb;
}

.pkpOpenReview__tabs-list .PkpTabTrigger[data-state='active'] {
	background: #fff;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.pkpOpenReview__tabs-list .PkpTabTrigger[data-state='active']::after {
	display: none;
}

.pkpOpenReview__heading {
	font-size: 1.125rem;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0;
}

/* Accordion */
.pkpOpenReview__accordion-item {
	border: 1px solid #e0e0e0;
	border-radius: 0.5rem;
	background: #fff;
	overflow: hidden;
	margin-top: 1rem;
}

.pkpOpenReview__accordion-item:first-child {
	margin-top: 0;
}

.pkpOpenReview__accordion-item .PkpAccordionHeader__trigger {
	padding: 1rem 1.25rem;
	background: #fff;
	border: none;
	cursor: pointer;
}

.pkpOpenReview__accordion-item .PkpAccordionHeader__trigger:hover {
	background: #f8f9fa;
}

/* Header wrapper */
.pkpOpenReview__header {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 0.25rem;
	width: 100%;
}

.pkpOpenReview__title {
	font-size: 1rem;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0;
}

.pkpOpenReview__header p {
	font-size: 0.875rem;
	color: #666;
	margin: 0;
}

.pkpOpenReview__accordion-content {
	padding: 0 1.25rem 1.25rem 1.25rem;
}

/* Header title group */
.pkpOpenReview__header-title {
	margin: 0;
}

.pkpOpenReview__header-title p {
	font-size: 0.875rem;
	color: #666;
	margin: 0.125rem 0 0;
}

.pkpOpenReview__review-count {
	font-size: 0.875rem;
	color: #666;
	margin: 0.25rem 0 0;
}

/* Summary list */
.pkpOpenReview__summary {
	display: flex;
	gap: 1rem;
	margin: 0.25rem 0 0;
	padding: 0;
}

.pkpOpenReview__summary-item {
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	font-size: 0.8125rem;
}

.pkpOpenReview__summary .PkpIcon {
	width: 1rem;
	height: 1rem;
}

.pkpOpenReview__summary [data-recommendation='approved'] .PkpIcon {
	color: #0d6d3d;
}

.pkpOpenReview__summary [data-recommendation='revisions_requested'] .PkpIcon {
	color: #b45309;
}

.pkpOpenReview__summary [data-recommendation='not_approved'] .PkpIcon {
	color: #dc2626;
}

.pkpOpenReview__summary [data-recommendation='with_comments'] .PkpIcon {
	color: #2563eb;
}

/* Reviews list */
.pkpOpenReview__list {
	list-style: none;
	margin: 0;
	padding: 0;
}

.pkpOpenReview__list li {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.875rem 0;
	border-top: 1px solid #e5e7eb;
}

.pkpOpenReview__list li:first-child {
	border-top: none;
}

/* Status badge */
.pkpOpenReview__status {
	display: inline-flex;
	align-items: center;
	gap: 0.375rem;
	font-size: 0.8125rem;
	padding-right: 0.75rem;
	border-right: 1px solid #e5e7eb;
	white-space: nowrap;
}

.pkpOpenReview__status .PkpIcon {
	width: 1.125rem;
	height: 1.125rem;
}

.pkpOpenReview__status[data-recommendation='approved'] .PkpIcon {
	color: #0d6d3d;
}

.pkpOpenReview__status[data-recommendation='revisions_requested'] .PkpIcon {
	color: #b45309;
}

.pkpOpenReview__status[data-recommendation='not_approved'] .PkpIcon {
	color: #dc2626;
}

.pkpOpenReview__status[data-recommendation='with_comments'] .PkpIcon {
	color: #2563eb;
}

/* Reviewer info */
.pkpOpenReview__reviewer,
.pkpOpenReview__version {
	font-weight: 600;
	font-size: 0.9375rem;
	color: #1a1a1a;
}

.pkpOpenReview__affiliation,
.pkpOpenReview__date {
	flex: 1;
	font-size: 0.875rem;
	color: #666;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>

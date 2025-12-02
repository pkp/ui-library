<template>
	<div class="PkpOpenReview">
		<BaseTabRoot default-value="byRecord">
			<header class="PkpOpenReview__tabs-header">
				<span class="PkpOpenReview__tabs-label">Sort by:</span>
				<BaseTabList class="PkpOpenReview__tabs-list">
					<BaseTabTrigger value="byRecord">Version of Record</BaseTabTrigger>
					<BaseTabTrigger value="byReviewer">Reviewer Name</BaseTabTrigger>
				</BaseTabList>
			</header>

			<!-- By Record View -->
			<BaseTabContent value="byRecord">
				<h2 class="PkpOpenReview__heading">Reviewer Reports by Record</h2>
				<AccordionRoot
					type="single"
					collapsible
					:default-value="reviewRounds[0]?.roundId"
				>
					<AccordionItem
						v-for="round in reviewRounds"
						:key="round.roundId"
						:value="round.roundId"
						class="PkpOpenReview__accordion-item"
					>
						<AccordionHeader as-child>
							<AccordionTrigger class="PkpOpenReview__accordion-trigger">
								<hgroup class="PkpOpenReview__header-title">
									<h3>
										{{ round.displayText }}
										<template v-if="round.date">
											• {{ formatShortDate(round.date) }}
										</template>
									</h3>
									<p>({{ round.reviews?.length || 0 }} Reviewers)</p>
								</hgroup>
								<ul class="PkpOpenReview__summary" aria-label="Review summary">
									<li
										v-for="item in getRoundSummary(round)"
										:key="item.recommendation"
										:data-recommendation="item.recommendation"
									>
										<PkpIcon :icon="item.recommendation" aria-hidden="true" />
										{{ item.count }} {{ item.label }}
									</li>
								</ul>
							</AccordionTrigger>
						</AccordionHeader>
						<AccordionContent class="PkpOpenReview__accordion-content">
							<ul class="PkpOpenReview__list">
								<li v-for="review in round.reviews" :key="review.reviewId">
									<span
										class="PkpOpenReview__status"
										:data-recommendation="review.recommendation"
									>
										<PkpIcon :icon="review.recommendation" aria-hidden="true" />
										{{ review.reviewerRecommendationDisplayText }}
									</span>
									<span class="PkpOpenReview__reviewer">
										{{ review.reviewerFullName }}
									</span>
									<span class="PkpOpenReview__affiliation">
										— {{ review.reviewerAffiliation }}
									</span>
									<BaseOpenReviewReadButton :review="review" />
								</li>
							</ul>
						</AccordionContent>
					</AccordionItem>
				</AccordionRoot>
			</BaseTabContent>

			<!-- By Reviewer View -->
			<BaseTabContent value="byReviewer">
				<h2 class="PkpOpenReview__heading">Reviewer Reports by Reviewer</h2>
				<AccordionRoot
					type="single"
					collapsible
					:default-value="reviewerGroups[0]?.reviewerId"
				>
					<AccordionItem
						v-for="reviewer in reviewerGroups"
						:key="reviewer.reviewerId"
						:value="reviewer.reviewerId"
						class="PkpOpenReview__accordion-item"
					>
						<AccordionHeader as-child>
							<AccordionTrigger class="PkpOpenReview__accordion-trigger">
								<hgroup class="PkpOpenReview__header-title">
									<h3>{{ reviewer.reviewerFullName }}</h3>
									<p>{{ reviewer.reviewerAffiliation }}</p>
								</hgroup>
								<p class="PkpOpenReview__review-count">
									{{ reviewer.reviews?.length || 0 }} Reviews
								</p>
							</AccordionTrigger>
						</AccordionHeader>
						<AccordionContent class="PkpOpenReview__accordion-content">
							<ul class="PkpOpenReview__list">
								<li v-for="review in reviewer.reviews" :key="review.reviewId">
									<span
										class="PkpOpenReview__status"
										:data-recommendation="review.recommendation"
									>
										<PkpIcon :icon="review.recommendation" aria-hidden="true" />
										{{ review.reviewerRecommendationDisplayText }}
									</span>
									<span class="PkpOpenReview__version">
										{{ review.roundDisplayText }}
									</span>
									<span class="PkpOpenReview__date">
										— {{ formatShortDate(review.roundDate) }}
									</span>
									<BaseOpenReviewReadButton :review="review" />
								</li>
							</ul>
						</AccordionContent>
					</AccordionItem>
				</AccordionRoot>
			</BaseTabContent>
		</BaseTabRoot>
	</div>
</template>

<script setup>
import {
	AccordionRoot,
	AccordionItem,
	AccordionHeader,
	AccordionTrigger,
	AccordionContent,
} from 'reka-ui';
import {storeToRefs} from 'pinia';
import BaseTabRoot from '@/frontend/components/PkpTab/base/BaseTabRoot.vue';
import BaseTabList from '@/frontend/components/PkpTab/base/BaseTabList.vue';
import BaseTabTrigger from '@/frontend/components/PkpTab/base/BaseTabTrigger.vue';
import BaseTabContent from '@/frontend/components/PkpTab/base/BaseTabContent.vue';
import BaseOpenReviewReadButton from './base/BaseOpenReviewReadButton.vue';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import {usePkpOpenReviewStore} from './usePkpOpenReviewStore';
import {usePkpDate} from '@/frontend/composables/usePkpDate';

const props = defineProps({
	openReviewData: {type: Object, required: true},
});

const store = usePkpOpenReviewStore();
store.initialize({openReviewData: props.openReviewData});

const {reviewRounds, reviewerGroups} = storeToRefs(store);
const {getRoundSummary} = store;
const {formatShortDate} = usePkpDate();
</script>

<style>
.PkpOpenReview {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.PkpOpenReview__tabs-header {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding-bottom: 1rem;
	border-bottom: 1px solid #e5e7eb;
}

.PkpOpenReview__tabs-label {
	font-size: 0.875rem;
	color: #666;
}

.PkpOpenReview__tabs-list {
	display: flex;
	background: #f3f4f6;
	border-radius: 0.375rem;
	padding: 0.25rem;
}

.PkpOpenReview__tabs-list .BaseTabTrigger {
	padding: 0.5rem 1rem;
	font-size: 0.875rem;
	font-weight: 500;
	background: transparent;
	border: none;
	border-radius: 0.25rem;
	cursor: pointer;
	color: #374151;
}

.PkpOpenReview__tabs-list .BaseTabTrigger:hover {
	background: #e5e7eb;
}

.PkpOpenReview__tabs-list .BaseTabTrigger[data-state='active'] {
	background: #fff;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.PkpOpenReview__tabs-list .BaseTabTrigger[data-state='active']::after {
	display: none;
}

.PkpOpenReview__heading {
	font-size: 1.125rem;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0;
}

/* Accordion */
.PkpOpenReview__accordion-item {
	border: 1px solid #e0e0e0;
	border-radius: 0.5rem;
	background: #fff;
	overflow: hidden;
	margin-top: 1rem;
}

.PkpOpenReview__accordion-item:first-child {
	margin-top: 0;
}

.PkpOpenReview__accordion-trigger {
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

.PkpOpenReview__accordion-trigger:hover {
	background: #f8f9fa;
}

.PkpOpenReview__accordion-content {
	padding: 0 1.25rem 1.25rem 1.25rem;
}

/* Header title group */
.PkpOpenReview__header-title {
	margin: 0;
}

.PkpOpenReview__header-title h3 {
	font-weight: 600;
	font-size: 1rem;
	color: #1a1a1a;
	margin: 0;
}

.PkpOpenReview__header-title p {
	font-size: 0.875rem;
	color: #666;
	margin: 0.125rem 0 0;
}

.PkpOpenReview__review-count {
	font-size: 0.875rem;
	color: #666;
	margin: 0.25rem 0 0;
}

/* Summary list */
.PkpOpenReview__summary {
	display: flex;
	gap: 1rem;
	margin: 0.25rem 0 0;
	padding: 0;
	list-style: none;
}

.PkpOpenReview__summary li {
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	font-size: 0.8125rem;
}

.PkpOpenReview__summary .BaseIcon {
	width: 1rem;
	height: 1rem;
}

.PkpOpenReview__summary [data-recommendation='approved'] .BaseIcon {
	color: #0d6d3d;
}

.PkpOpenReview__summary [data-recommendation='revisions_requested'] .BaseIcon {
	color: #b45309;
}

.PkpOpenReview__summary [data-recommendation='not_approved'] .BaseIcon {
	color: #dc2626;
}

.PkpOpenReview__summary [data-recommendation='comments'] .BaseIcon {
	color: #2563eb;
}

/* Reviews list */
.PkpOpenReview__list {
	list-style: none;
	margin: 0;
	padding: 0;
}

.PkpOpenReview__list li {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.875rem 0;
	border-top: 1px solid #e5e7eb;
}

.PkpOpenReview__list li:first-child {
	border-top: none;
}

/* Status badge */
.PkpOpenReview__status {
	display: inline-flex;
	align-items: center;
	gap: 0.375rem;
	font-size: 0.8125rem;
	padding-right: 0.75rem;
	border-right: 1px solid #e5e7eb;
	white-space: nowrap;
}

.PkpOpenReview__status .BaseIcon {
	width: 1.125rem;
	height: 1.125rem;
}

.PkpOpenReview__status[data-recommendation='approved'] .BaseIcon {
	color: #0d6d3d;
}

.PkpOpenReview__status[data-recommendation='revisions_requested'] .BaseIcon {
	color: #b45309;
}

.PkpOpenReview__status[data-recommendation='not_approved'] .BaseIcon {
	color: #dc2626;
}

.PkpOpenReview__status[data-recommendation='comments'] .BaseIcon {
	color: #2563eb;
}

/* Reviewer info */
.PkpOpenReview__reviewer,
.PkpOpenReview__version {
	font-weight: 600;
	font-size: 0.9375rem;
	color: #1a1a1a;
}

.PkpOpenReview__affiliation,
.PkpOpenReview__date {
	flex: 1;
	font-size: 0.875rem;
	color: #666;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>

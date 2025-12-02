<template>
	<BaseOpenReview :open-review="openReview">
		<BaseTabRoot default-value="byRecord">
			<div class="BaseOpenReviewTabsHeader">
				<span class="BaseOpenReviewTabsLabel">Sort by:</span>
				<BaseTabList class="BaseOpenReviewTabsList">
					<BaseTabTrigger value="byRecord" class="BaseOpenReviewTabsTrigger">
						Version of Record
					</BaseTabTrigger>
					<BaseTabTrigger value="byReviewer" class="BaseOpenReviewTabsTrigger">
						Reviewer Name
					</BaseTabTrigger>
				</BaseTabList>
			</div>

			<!-- By Record View -->
			<BaseTabContent value="byRecord" class="BaseOpenReviewTabsContent">
				<h2 class="BaseOpenReviewHeading">Reviewer Reports by Record</h2>
				<BaseOpenReviewRounds v-slot="{round, summary}">
					<BaseOpenReviewRound :round="round">
						<BaseOpenReviewRoundHeader>
							<div class="BaseOpenReviewRoundHeaderMain">
								<span class="BaseOpenReviewRoundHeaderTitle">
									{{ round.displayText }}
									<template v-if="round.date">
										• {{ formatShortDate(round.date) }}
									</template>
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
									{{ item.count }} {{ item.label }}
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
			</BaseTabContent>

			<!-- By Reviewer View -->
			<BaseTabContent value="byReviewer" class="BaseOpenReviewTabsContent">
				<h2 class="BaseOpenReviewHeading">Reviewer Reports by Reviewer</h2>
				<BaseOpenReviewReviewers v-slot="{reviewer}">
					<BaseOpenReviewReviewer :reviewer="reviewer">
						<BaseOpenReviewRoundHeader>
							<div class="BaseOpenReviewRoundHeaderMain">
								<span class="BaseOpenReviewRoundHeaderTitle">
									{{ reviewer.reviewerFullName }}
								</span>
							</div>
							<div class="BaseOpenReviewReviewerAffiliation">
								{{ reviewer.reviewerAffiliation }}
							</div>
							<div class="BaseOpenReviewReviewerCount">
								{{ reviewer.reviews.length }} Reviews
							</div>
						</BaseOpenReviewRoundHeader>
						<BaseOpenReviewRoundContent>
							<BaseOpenReviewRoundReviews
								v-slot="{review}"
								:reviews="reviewer.reviews"
							>
								<BaseOpenReviewRoundReview :review="review">
									<span class="BaseOpenReviewRoundReviewStatus">
										<PkpIcon :icon="review.recommendation" />
										{{ review.reviewerRecommendationDisplayText }}
									</span>
									<span class="BaseOpenReviewRoundReviewVersionTitle">
										{{ review.roundDisplayText }}
									</span>
									<span class="BaseOpenReviewRoundReviewVersionDate">
										— {{ formatShortDate(review.roundDate) }}
									</span>
									<button class="BaseOpenReviewRoundReviewReadBtn">
										Read Review
									</button>
								</BaseOpenReviewRoundReview>
							</BaseOpenReviewRoundReviews>
						</BaseOpenReviewRoundContent>
					</BaseOpenReviewReviewer>
				</BaseOpenReviewReviewers>
			</BaseTabContent>
		</BaseTabRoot>
	</BaseOpenReview>
</template>
<script setup>
import BaseTabRoot from '@/frontend/components/PkpTab/base/BaseTabRoot.vue';
import BaseTabList from '@/frontend/components/PkpTab/base/BaseTabList.vue';
import BaseTabTrigger from '@/frontend/components/PkpTab/base/BaseTabTrigger.vue';
import BaseTabContent from '@/frontend/components/PkpTab/base/BaseTabContent.vue';
import BaseOpenReview from './base/BaseOpenReview.vue';
import BaseOpenReviewRounds from './base/BaseOpenReviewRounds.vue';
import BaseOpenReviewRound from './base/BaseOpenReviewRound.vue';
import BaseOpenReviewReviewers from './base/BaseOpenReviewReviewers.vue';
import BaseOpenReviewReviewer from './base/BaseOpenReviewReviewer.vue';
import BaseOpenReviewRoundHeader from './base/BaseOpenReviewRoundHeader.vue';
import BaseOpenReviewRoundContent from './base/BaseOpenReviewRoundContent.vue';
import BaseOpenReviewRoundReviews from './base/BaseOpenReviewRoundReviews.vue';
import BaseOpenReviewRoundReview from './base/BaseOpenReviewRoundReview.vue';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import {usePkpDate} from '@/frontend/composables/usePkpDate';

const {formatShortDate} = usePkpDate();

defineProps({
	openReview: {type: Object, required: true},
});
</script>

<style>
/* Main container */
.BaseOpenReview {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

/* Tabs header with label and pill switcher */
.BaseOpenReviewTabsHeader {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding-bottom: 1rem;
	border-bottom: 1px solid #e5e7eb;
}

.BaseOpenReviewTabsLabel {
	font-size: 0.875rem;
	color: #666;
}

/* Override BaseTabList default styles for pill appearance */
.BaseOpenReviewTabsList.BaseTabRoot {
	display: flex;
	background: #f3f4f6;
	border-radius: 0.375rem;
	padding: 0.25rem;
	border-bottom: none;
	margin-bottom: 0;
	gap: 0;
}

/* Override BaseTabTrigger for pill buttons */
.BaseOpenReviewTabsTrigger.BaseTabTrigger {
	padding: 0.5rem 1rem;
	font-size: 0.875rem;
	font-weight: 500;
	background: transparent;
	border: none;
	border-radius: 0.25rem;
	cursor: pointer;
	color: #374151;
}

.BaseOpenReviewTabsTrigger.BaseTabTrigger:hover {
	background: #e5e7eb;
}

.BaseOpenReviewTabsTrigger.BaseTabTrigger[data-state='active'] {
	background: #fff;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	color: #374151;
	font-weight: 500;
}

.BaseOpenReviewTabsTrigger.BaseTabTrigger[data-state='active']::after {
	display: none;
}

/* Tab content panels */
.BaseOpenReviewTabsContent {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.BaseOpenReviewTabsContent[data-state='inactive'] {
	display: none;
}

/* Heading */
.BaseOpenReviewHeading {
	font-size: 1.125rem;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0;
}

/* Accordion container (AccordionRoot) */
.BaseOpenReviewAccordion,
.BaseOpenReviewRounds,
.BaseOpenReviewReviewers {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

/* Single accordion item (AccordionItem) */
.BaseOpenReviewRound,
.BaseOpenReviewReviewer {
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
}

.BaseOpenReviewRoundHeaderCount {
	font-size: 0.875rem;
	color: #666;
}

/* Reviewer affiliation in header (for by-reviewer view) */
.BaseOpenReviewReviewerAffiliation {
	font-size: 0.875rem;
	color: #666;
	margin-top: 0.125rem;
}

.BaseOpenReviewReviewerCount {
	font-size: 0.875rem;
	color: #666;
	margin-top: 0.25rem;
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

/* Version title (for by-reviewer view) */
.BaseOpenReviewRoundReviewVersionTitle {
	font-weight: 600;
	font-size: 0.9375rem;
	color: #1a1a1a;
}

/* Version date (for by-reviewer view) */
.BaseOpenReviewRoundReviewVersionDate {
	flex: 1;
	font-size: 0.875rem;
	color: #666;
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

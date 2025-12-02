<template>
	<BaseOpenReview :open-review-data="openReviewData">
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
				<BaseOpenReviewRounds v-slot="{round, summary, reviewCount}">
					<BaseOpenReviewRound :round="round">
						<BaseOpenReviewHeader>
							<div class="BaseOpenReviewHeaderMain">
								<span class="BaseOpenReviewHeaderTitle">
									{{ round.displayText }}
									<template v-if="round.date">
										• {{ formatShortDate(round.date) }}
									</template>
								</span>
								<span class="BaseOpenReviewHeaderCount">
									({{ reviewCount }} Reviewers)
								</span>
							</div>
							<div class="BaseOpenReviewHeaderSummary">
								<span
									v-for="item in summary"
									:key="item.recommendation"
									class="BaseOpenReviewHeaderSummaryBadge"
									:class="`BaseOpenReviewHeaderSummaryBadge--${item.recommendation}`"
								>
									<PkpIcon :icon="item.recommendation" />
									{{ item.count }} {{ item.label }}
								</span>
							</div>
						</BaseOpenReviewHeader>
						<BaseOpenReviewContent>
							<BaseOpenReviewList v-slot="{review}">
								<BaseOpenReviewListItem :review="review">
									<span
										class="BaseOpenReviewListItemStatus"
										:class="`BaseOpenReviewListItemStatus--${review.recommendation}`"
									>
										<PkpIcon :icon="review.recommendation" />
										{{ review.reviewerRecommendationDisplayText }}
									</span>
									<span class="BaseOpenReviewListItemReviewerName">
										{{ review.reviewerFullName }}
									</span>
									<span class="BaseOpenReviewListItemReviewerAffiliation">
										— {{ review.reviewerAffiliation }}
									</span>
									<BaseOpenReviewReadButton />
								</BaseOpenReviewListItem>
							</BaseOpenReviewList>
						</BaseOpenReviewContent>
					</BaseOpenReviewRound>
				</BaseOpenReviewRounds>
			</BaseTabContent>

			<!-- By Reviewer View -->
			<BaseTabContent value="byReviewer" class="BaseOpenReviewTabsContent">
				<h2 class="BaseOpenReviewHeading">Reviewer Reports by Reviewer</h2>
				<BaseOpenReviewReviewers v-slot="{reviewer, reviewCount}">
					<BaseOpenReviewReviewer :reviewer="reviewer">
						<BaseOpenReviewHeader>
							<div class="BaseOpenReviewHeaderMain">
								<span class="BaseOpenReviewHeaderTitle">
									{{ reviewer.reviewerFullName }}
								</span>
							</div>
							<div class="BaseOpenReviewReviewerAffiliation">
								{{ reviewer.reviewerAffiliation }}
							</div>
							<div class="BaseOpenReviewReviewerCount">
								{{ reviewCount }} Reviews
							</div>
						</BaseOpenReviewHeader>
						<BaseOpenReviewContent>
							<BaseOpenReviewList v-slot="{review}">
								<BaseOpenReviewListItem :review="review">
									<span
										class="BaseOpenReviewListItemStatus"
										:class="`BaseOpenReviewListItemStatus--${review.recommendation}`"
									>
										<PkpIcon :icon="review.recommendation" />
										{{ review.reviewerRecommendationDisplayText }}
									</span>
									<span class="BaseOpenReviewListItemVersionTitle">
										{{ review.roundDisplayText }}
									</span>
									<span class="BaseOpenReviewListItemVersionDate">
										— {{ formatShortDate(review.roundDate) }}
									</span>
									<BaseOpenReviewReadButton />
								</BaseOpenReviewListItem>
							</BaseOpenReviewList>
						</BaseOpenReviewContent>
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
import BaseOpenReviewHeader from './base/BaseOpenReviewHeader.vue';
import BaseOpenReviewContent from './base/BaseOpenReviewContent.vue';
import BaseOpenReviewList from './base/BaseOpenReviewList.vue';
import BaseOpenReviewListItem from './base/BaseOpenReviewListItem.vue';
import BaseOpenReviewReadButton from './base/BaseOpenReviewReadButton.vue';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import {usePkpDate} from '@/frontend/composables/usePkpDate';

const {formatShortDate} = usePkpDate();

defineProps({
	openReviewData: {type: Object, required: true},
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
.BaseOpenReviewHeader {
	width: 100%;
	margin: 0;
}

.BaseOpenReviewHeaderTrigger {
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

.BaseOpenReviewHeaderTrigger:hover {
	background: #f8f9fa;
}

/* Chevron rotation when open */
.BaseOpenReviewHeaderTrigger[data-state='open'] .BaseOpenReviewHeaderChevron {
	transform: rotate(180deg);
}

/* Round header main line */
.BaseOpenReviewHeaderMain {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.BaseOpenReviewHeaderTitle {
	font-weight: 600;
	font-size: 1rem;
	color: #1a1a1a;
}

.BaseOpenReviewHeaderCount {
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
.BaseOpenReviewHeaderSummary {
	display: flex;
	gap: 1rem;
	margin-top: 0.25rem;
}

.BaseOpenReviewHeaderSummaryBadge {
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	font-size: 0.8125rem;
}

.BaseOpenReviewHeaderSummaryBadge .BaseIcon {
	width: 1rem;
	height: 1rem;
}

.BaseOpenReviewHeaderSummaryBadge--approved .BaseIcon {
	color: #0d6d3d;
}

.BaseOpenReviewHeaderSummaryBadge--revisions_requested .BaseIcon {
	color: #b45309;
}

.BaseOpenReviewHeaderSummaryBadge--not_approved .BaseIcon {
	color: #dc2626;
}

.BaseOpenReviewHeaderSummaryBadge--comments .BaseIcon {
	color: #2563eb;
}

/* Round content (AccordionContent) */
.BaseOpenReviewContent {
	padding: 0 1.25rem 1.25rem 1.25rem;
}

/* Reviews list */
.BaseOpenReviewList {
	list-style: none;
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: column;
}

/* Single review item */
.BaseOpenReviewListItem {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.875rem 0;
	border-top: 1px solid #e5e7eb;
}

.BaseOpenReviewListItem:first-child {
	border-top: none;
}

/* Review status badge */
.BaseOpenReviewListItemStatus {
	display: inline-flex;
	align-items: center;
	gap: 0.375rem;
	font-size: 0.8125rem;
	padding-right: 0.75rem;
	border-right: 1px solid #e5e7eb;
	white-space: nowrap;
}

.BaseOpenReviewListItemStatus .BaseIcon {
	width: 1.125rem;
	height: 1.125rem;
}

.BaseOpenReviewListItemStatus--approved .BaseIcon {
	color: #0d6d3d;
}

.BaseOpenReviewListItemStatus--revisions_requested .BaseIcon {
	color: #b45309;
}

.BaseOpenReviewListItemStatus--not_approved .BaseIcon {
	color: #dc2626;
}

.BaseOpenReviewListItemStatus--comments .BaseIcon {
	color: #2563eb;
}

/* Reviewer name */
.BaseOpenReviewListItemReviewerName {
	font-weight: 600;
	font-size: 0.9375rem;
	color: #1a1a1a;
}

/* Reviewer affiliation */
.BaseOpenReviewListItemReviewerAffiliation {
	flex: 1;
	font-size: 0.875rem;
	color: #666;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

/* Version title (for by-reviewer view) */
.BaseOpenReviewListItemVersionTitle {
	font-weight: 600;
	font-size: 0.9375rem;
	color: #1a1a1a;
}

/* Version date (for by-reviewer view) */
.BaseOpenReviewListItemVersionDate {
	flex: 1;
	font-size: 0.875rem;
	color: #666;
}

/* Read Review button */
.BaseOpenReviewReadButton {
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

.BaseOpenReviewReadButton:hover {
	background: #1a56db;
	color: #fff;
}
</style>

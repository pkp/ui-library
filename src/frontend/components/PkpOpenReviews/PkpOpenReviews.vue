<template>
	<div :class="cn('root')">
		<!-- Not Available State -->
		<div
			v-if="
				store.reviewState === ReviewState.NOT_AVAILABLE ||
				!store.reviewRounds.length
			"
			:class="cn('not-available')"
		>
			<svg
				width="48"
				height="48"
				viewBox="0 0 48 48"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M11.93 30.5773H16.5131V28.688H11.93V30.5773ZM11.93 22.0758H27.7085V20.2915H11.93V22.0758ZM11.93 13.6793H27.7085V11.895H11.93V13.6793ZM24.0168 48C20.6978 48 17.5755 47.3698 14.6498 46.1094C11.7241 44.8485 9.17901 43.1377 7.01458 40.977C4.85015 38.8159 3.14006 36.2776 1.88431 33.3621C0.628105 30.4466 0 27.3315 0 24.0168C0 20.6978 0.630204 17.5755 1.89061 14.6498C3.15149 11.7241 4.86227 9.17901 7.02297 7.01458C9.18414 4.85015 11.7225 3.14006 14.6379 1.88431C17.5534 0.628105 20.6685 0 23.9832 0C27.3022 0 30.4245 0.630205 33.3502 1.89061C36.2759 3.15149 38.821 4.86227 40.9854 7.02297C43.1499 9.18414 44.8599 11.7225 46.1157 14.6379C47.3719 17.5534 48 20.6685 48 23.9832C48 27.3022 47.3698 30.4245 46.1094 33.3502C44.8485 36.2759 43.1377 38.821 40.977 40.9854C38.8159 43.1499 36.2776 44.8599 33.3621 46.1157C30.4466 47.3719 27.3315 48 24.0168 48ZM23.9979 46.2157C30.1801 46.2157 35.4286 44.059 39.7434 39.7455C44.0583 35.4325 46.2157 30.1847 46.2157 24.0021C46.2157 17.8199 44.059 12.5714 39.7455 8.25656C35.4325 3.94169 30.1847 1.78426 24.0021 1.78426C17.8199 1.78426 12.5714 3.94099 8.25656 8.25446C3.94169 12.5675 1.78426 17.8153 1.78426 23.9979C1.78426 30.1801 3.94099 35.4286 8.25446 39.7434C12.5675 44.0583 17.8153 46.2157 23.9979 46.2157Z"
					fill="currentColor"
				/>
				<path
					d="M39.3916 30.2974C39.3916 33.7753 36.5722 36.5948 33.0943 36.5948C29.6163 36.5948 26.7969 33.7753 26.7969 30.2974C26.7969 26.8194 29.6163 24 33.0943 24C36.5722 24 39.3916 26.8194 39.3916 30.2974Z"
					fill="currentColor"
				/>
				<path
					d="M19.8047 46.3906C19.8047 46.3906 19.8047 37.9941 33.0991 37.9941C36.863 37.9941 39.5613 38.4929 41.4956 39.3936C28.8982 50.4595 19.8047 46.3906 19.8047 46.3906Z"
					fill="currentColor"
				/>
			</svg>
			{{ t('openReview.dataNotAvailable') }}
		</div>
		<PkpTabRoot v-else default-value="byRound">
			<div :class="cn('tabs-header')">
				<span :id="sortLabelId" :class="cn('tabs-label')">
					{{ t('openReview.sortBy') }}
				</span>
				<PkpTabList :aria-labelledby="sortLabelId" :class="cn('tabs-buttons')">
					<PkpTabTrigger value="byRound" :class="cn('tabs-button')">
						{{ t('openReview.sortByReviewRound') }}
					</PkpTabTrigger>
					<PkpTabTrigger value="byReviewer" :class="cn('tabs-button')">
						{{ t('openReview.sortByReviewerName') }}
					</PkpTabTrigger>
				</PkpTabList>
			</div>
			<PkpTabContent value="byRound">
				<PkpOpenReviewsList
					v-for="round in store.reviewRoundsDisplay"
					:key="round.roundId"
					:title="t('openReview.roundNumber', {number: round.roundNumber})"
					:subtitle="round.publication?.versionString ?? ''"
				>
					<PkpAccordionRoot
						:model-value="store.expandedContentIds"
						type="multiple"
						:class="cn('items')"
						@update:model-value="store.setExpandedContent"
					>
						<PkpOpenReview
							v-for="review in round.reviews"
							:key="review.id"
							:review="review"
						/>
						<PkpOpenReviewAuthorResponse
							v-if="round.authorResponse"
							:round="round.id"
							:date="round.authorResponse.createdAt"
							:authors="round.authorResponse.associatedAuthors"
							:response="round.authorResponse.response"
						/>
					</PkpAccordionRoot>
				</PkpOpenReviewsList>
			</PkpTabContent>
			<PkpTabContent value="byReviewer">
				<PkpOpenReviewsList
					v-for="reviewer in store.reviewerGroups"
					:key="reviewer.reviewerId"
					:title="reviewer.reviewerFullName"
					:subtitle="reviewer?.reviewerAffiliation ?? ''"
				>
					<PkpAccordionRoot
						:model-value="store.expandedContentIds"
						type="multiple"
						:class="cn('items')"
						@update:model-value="store.setExpandedContent"
					>
						<PkpOpenReview
							v-for="review in reviewer.reviews"
							:key="review.id"
							:review="review"
							:show-round="true"
						/>
					</PkpAccordionRoot>
				</PkpOpenReviewsList>
			</PkpTabContent>
		</PkpTabRoot>
	</div>
</template>

<script setup>
import PkpTabRoot from '@/frontend/components/PkpTab/PkpTabRoot.vue';
import PkpTabList from '@/frontend/components/PkpTab/PkpTabList.vue';
import PkpTabTrigger from '@/frontend/components/PkpTab/PkpTabTrigger.vue';
import PkpTabContent from '@/frontend/components/PkpTab/PkpTabContent.vue';
import {useId, onMounted} from 'vue';
import {usePkpOpenReviewsStore, ReviewState} from './usePkpOpenReviewsStore.js';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import PkpOpenReviewsList from './PkpOpenReviewsList.vue';
import PkpAccordionRoot from '../PkpAccordion/PkpAccordionRoot.vue';
import PkpOpenReview from './PkpOpenReview.vue';
import PkpOpenReviewAuthorResponse from './PkpOpenReviewAuthorResponse.vue';

const props = defineProps({
	submissionPeerReviews: {type: Object, required: true},
	submissionPeerReviewSummary: {type: Object, required: true},
	headingLevel: {type: Number, default: 3},
	summaryHeadingLevel: {type: Number, default: 2},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviews', props.styles);
const {t} = usePkpLocalize();
const sortLabelId = useId();

const store = usePkpOpenReviewsStore();
store.initialize({
	submissionPeerReviews: props.submissionPeerReviews,
	submissionPeerReviewSummary: props.submissionPeerReviewSummary,
	headingLevel: props.headingLevel,
	summaryHeadingLevel: props.summaryHeadingLevel,
});

onMounted(() => store.scrollToReviewFromUrl());
</script>

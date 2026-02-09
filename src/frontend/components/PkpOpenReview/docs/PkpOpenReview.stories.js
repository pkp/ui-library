import '@/styles/frontend-theme.css';
import PkpOpenReview from '../PkpOpenReview.vue';
import {
	mockPublicationsPeerReviews,
	mockSubmissionPeerReviewSummary,
} from './mockOpenReviewData.js';

export default {
	title: 'Frontend/PkpOpenReview',
	component: PkpOpenReview,
	render: (args) => ({
		components: {PkpOpenReview},
		setup() {
			return {args};
		},
		template: '<PkpOpenReview v-bind="args"></PkpOpenReview>',
	}),
};

const defaultArgs = {
	publicationsPeerReviews: mockPublicationsPeerReviews,
	submissionPeerReviewSummary: mockSubmissionPeerReviewSummary,
};

export const Default = {
	args: defaultArgs,
};

export const CustomRoundHeader = {
	args: defaultArgs,
	render: (args) => ({
		components: {PkpOpenReview},
		setup() {
			return {args};
		},
		template: `
			<PkpOpenReview v-bind="args">
				<template #roundHeader="{ round, summary, reviewCount }">
					<div style="display: flex; align-items: center; gap: 12px; width: 100%;">
						<span style="background: #1a56db; color: white; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 600;">
							{{ round.displayText }}
						</span>
						<span style="color: #666; font-size: 14px;">{{ reviewCount }} reviewers</span>
						<div style="margin-left: auto; display: flex; gap: 8px;">
							<span v-for="item in summary" :key="item.typeKey" style="font-size: 12px;">
								{{ item.count }} {{ item.label }}
							</span>
						</div>
					</div>
				</template>
			</PkpOpenReview>
		`,
	}),
};

export const CustomReviewItem = {
	args: defaultArgs,
	render: (args) => ({
		components: {PkpOpenReview},
		setup() {
			return {args};
		},
		template: `
			<PkpOpenReview v-bind="args">
				<template #reviewHeader="{ review }">
					<div style="display: flex; align-items: center; padding: 12px; background: #f8f9fa; border-radius: 8px; gap: 16px; width: 100%;">
						<div style="width: 40px; height: 40px; background: #e5e7eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #374151; flex-shrink: 0;">
							{{ review.reviewerFullName.charAt(0) }}
						</div>
						<div style="flex: 1; min-width: 0;">
							<div style="font-weight: 600;">{{ review.reviewerFullName }}</div>
							<div style="font-size: 12px; color: #666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ review.reviewerAffiliation }}</div>
						</div>
						<span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; flex-shrink: 0;"
								:style="{ background: review.reviewerRecommendationTypeKey === 'approved' ? '#d1fae5' : '#fef3c7' }">
							{{ review.reviewerRecommendationDisplayText }}
						</span>
					</div>
				</template>
			</PkpOpenReview>
		`,
	}),
};

export const CustomReviewerHeader = {
	args: defaultArgs,
	render: (args) => ({
		components: {PkpOpenReview},
		setup() {
			return {args};
		},
		template: `
			<PkpOpenReview v-bind="args">
				<template #reviewerHeader="{ reviewer, reviewCount }">
					<div style="display: flex; align-items: center; gap: 12px; width: 100%;">
						<div style="width: 48px; height: 48px; background: #dbeafe; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #1d4ed8; font-size: 18px;">
							{{ reviewer.reviewerFullName.split(' ').map(n => n[0]).join('') }}
						</div>
						<div style="flex: 1;">
							<div style="font-weight: 600; font-size: 16px;">{{ reviewer.reviewerFullName }}</div>
							<div style="font-size: 13px; color: #666;">{{ reviewer.reviewerAffiliation }}</div>
						</div>
						<span style="background: #f3f4f6; padding: 6px 12px; border-radius: 16px; font-size: 13px; color: #374151;">
							{{ reviewCount }} {{ reviewCount === 1 ? 'review' : 'reviews' }}
						</span>
					</div>
				</template>
			</PkpOpenReview>
		`,
	}),
};

export const MinimalLayout = {
	args: defaultArgs,
	render: (args) => ({
		components: {PkpOpenReview},
		setup() {
			return {args};
		},
		template: `
			<PkpOpenReview v-bind="args">
				<template #roundHeader="{ round, reviewCount }">
					<span style="font-weight: 600;">{{ round.displayText }}</span>
					<span style="color: #666; margin-left: 8px;">({{ reviewCount }})</span>
				</template>
				<template #reviewHeader="{ review }">
					<span style="flex: 1;">{{ review.reviewerFullName }}</span>
					<span style="color: #666; font-size: 13px;">{{ review.reviewerRecommendationDisplayText }}</span>
				</template>
			</PkpOpenReview>
		`,
	}),
};

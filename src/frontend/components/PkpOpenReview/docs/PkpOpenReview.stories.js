import '@/styles/frontend-theme.css';
import PkpOpenReview from '../PkpOpenReview.vue';
import {
	mockPublicationsPeerReviews,
	mockSubmissionPeerReviewSummary,
	mockSubmissionPeerReviewSummaryInProgress,
	mockSubmissionPeerReviewSummaryNotAvailable,
} from './mockOpenReviewData.js';

// Note: "Completed" and "In Progress" states render identically when review
// rounds exist, so a single Default story covers both. InProgressNoRounds
// demonstrates the distinct empty-state UI.

export default {
	title: 'Frontend/PkpOpenReview/Full View',
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

export const InProgressOrCompleted = {
	args: defaultArgs,
};

export const InProgressNoRounds = {
	args: {
		publicationsPeerReviews: [],
		submissionPeerReviewSummary: mockSubmissionPeerReviewSummaryInProgress,
	},
};

export const NotAvailable = {
	args: {
		publicationsPeerReviews: [],
		submissionPeerReviewSummary: mockSubmissionPeerReviewSummaryNotAvailable,
	},
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
				<template #roundHeader="{ round, reviewCount, headingLevel }">
					<div style="display: flex; align-items: center; gap: 12px; width: 100%;">
						<component :is="'h' + headingLevel" style="margin: 0; background: #1a56db; color: white; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 600;">
							{{ round.displayText }}
						</component>
						<span style="color: #666; font-size: 14px;">{{ reviewCount }} reviewers</span>
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
				<template #reviewerHeader="{ reviewer, reviewCount, headingLevel }">
					<div style="display: flex; align-items: center; gap: 12px; width: 100%;">
						<div style="width: 48px; height: 48px; background: #dbeafe; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #1d4ed8; font-size: 18px;">
							{{ reviewer.reviewerFullName.split(' ').map(n => n[0]).join('') }}
						</div>
						<div style="flex: 1;">
							<component :is="'h' + headingLevel" style="margin: 0; font-weight: 600; font-size: 16px;">{{ reviewer.reviewerFullName }}</component>
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
				<template #roundHeader="{ round, reviewCount, headingLevel }">
					<component :is="'h' + headingLevel" style="margin: 0; font-size: 16px; font-weight: 600;">
						{{ round.displayText }}
						<span style="color: #666; font-weight: 400;">({{ reviewCount }})</span>
					</component>
				</template>
				<template #reviewHeader="{ review }">
					<span style="display: flex; align-items: center; gap: 12px; width: 100%;">
						<span style="flex: 1;">{{ review.reviewerFullName }}</span>
						<span style="color: #666; font-size: 13px;">{{ review.reviewerRecommendationDisplayText }}</span>
					</span>
				</template>
			</PkpOpenReview>
		`,
	}),
};

const tailwindStyles = {
	removeDefaultClasses: true,
	// PkpOpenReview own elements
	root: 'flex flex-col gap-8 font-sans',
	tabsHeader: 'flex items-center gap-3 pb-4 border-b border-[#e0e7ff]',
	tabsLabel: 'text-[0.875rem] text-[#6366f1]',

	// Nested: Tab components — underline style instead of pill container
	PkpTabList: {root: 'flex gap-1 border-b border-[#e0e7ff]'},
	PkpTabTrigger: {
		root: 'px-4 py-2.5 text-[0.875rem] font-medium bg-transparent border-none border-b-2 border-b-transparent cursor-pointer text-[#6b7280] hover:text-[#4f46e5] hover:border-b-[#c7d2fe] data-[state=active]:text-[#4f46e5] data-[state=active]:border-b-[#6366f1]',
	},

	// Nested: shared accordion chrome for all expandable cards
	PkpAccordionHeader: {
		trigger:
			'flex items-center justify-between gap-4 w-full px-5 py-4 text-start bg-transparent border-none cursor-pointer hover:bg-[#eef2ff]',
		content: 'min-w-0',
		indicator: 'flex shrink-0',
	},
	PkpAccordionContent: {root: 'px-5 pb-5'},

	// Nested: ByRound view
	PkpOpenReviewByRound: {
		root: 'flex flex-col gap-6',
		roundItem: 'flex flex-col gap-3',
		roundHeader: 'flex items-baseline justify-between gap-4 w-full',
		roundHeading: 'm-0 flex flex-col gap-0.5 min-w-0',
		roundNumber: 'text-[1rem] font-semibold text-[#4f46e5]',
		roundVersion: 'text-[0.875rem] text-[#64748b]',
		roundStatus: 'flex items-center gap-2 whitespace-nowrap',
		roundStatusLabel: 'text-[0.75rem] uppercase tracking-wider text-[#64748b]',
		roundStatusValue: 'text-[13px] font-semibold text-[#0f172a]',
		roundContent: 'flex flex-col gap-3',

		// Review cards — shadow + indigo left accent instead of full border
		reviewItem:
			'border-l-[3px] border-l-[#6366f1] rounded-lg bg-[#ffffff] overflow-hidden shadow-[0_1px_3px_0_rgb(0,0,0,0.1),0_1px_2px_-1px_rgb(0,0,0,0.1)]',
		reviewHeader: 'flex items-start gap-3 w-full min-w-0',
		reviewStatus:
			'inline-flex items-center mt-0.5 data-[recommendation=approved]:text-[#059669] data-[recommendation=revisionsRequested]:text-[#d97706] data-[recommendation=notApproved]:text-[#e11d48] data-[recommendation=withComments]:text-[#6366f1]',
		reviewStatusIcon: 'w-[1.125rem] h-[1.125rem]',
		reviewHeaderText: 'flex flex-col gap-0.5 min-w-0',
		reviewStatusText: 'font-semibold text-[15px] text-[#0f172a]',
		reviewHeaderMeta: 'text-[0.875rem] text-[#64748b]',
		reviewer: 'font-medium text-[#4f46e5]',
		metaSeparator: 'mx-2 text-[#c7d2fe]',
		reviewDate: 'whitespace-nowrap',
		metaRight: 'whitespace-nowrap',
		readButton:
			'text-[13px] font-medium text-[#6366f1] whitespace-nowrap underline hover:text-[#4338ca]',

		// Author response card — indigo-tinted background
		authorResponseItem:
			'border-l-[3px] border-l-[#6366f1] rounded-lg bg-[#eef2ff] overflow-hidden shadow-[0_1px_2px_0_rgb(0,0,0,0.05)]',
		authorResponseHeader: 'flex items-start gap-3 w-full min-w-0',
		authorResponseStatus: 'inline-flex items-center mt-0.5 text-[#6366f1]',
		authorResponseIcon: 'w-[1.125rem] h-[1.125rem]',
		authorResponseHeaderText: 'flex flex-col gap-0.5 min-w-0',
		authorResponseLabel: 'font-semibold text-[15px] text-[#4f46e5]',
		authorResponseHeaderMeta: 'text-[0.875rem] text-[#64748b]',
		authorResponseAuthors: 'font-medium text-[#334155]',
		authorResponseDate: 'whitespace-nowrap',
	},

	// Nested: ByReviewer view
	PkpOpenReviewByReviewer: {
		root: 'flex flex-col gap-6',
		reviewerItem: 'flex flex-col gap-3',
		reviewerHeader: 'flex flex-col gap-1 w-full text-start',
		reviewerHeading: 'm-0 text-[1rem] font-semibold text-[#4f46e5]',
		reviewerAffiliation:
			'text-[0.875rem] text-[#64748b] overflow-hidden text-ellipsis whitespace-nowrap',
		reviewerContent: 'flex flex-col gap-3',

		// Review cards — same treatment as the ByRound view
		reviewItem:
			'border-l-[3px] border-l-[#6366f1] rounded-lg bg-[#ffffff] overflow-hidden shadow-[0_1px_3px_0_rgb(0,0,0,0.1),0_1px_2px_-1px_rgb(0,0,0,0.1)]',
		reviewHeader: 'flex items-start gap-3 w-full min-w-0',
		reviewStatus:
			'inline-flex items-center mt-0.5 data-[recommendation=approved]:text-[#059669] data-[recommendation=revisionsRequested]:text-[#d97706] data-[recommendation=notApproved]:text-[#e11d48] data-[recommendation=withComments]:text-[#6366f1]',
		reviewStatusIcon: 'w-[1.125rem] h-[1.125rem]',
		reviewHeaderText: 'flex flex-col gap-0.5 min-w-0',
		reviewStatusText: 'font-semibold text-[15px] text-[#0f172a]',
		reviewHeaderMeta: 'text-[0.875rem] text-[#64748b]',
		version: 'font-medium text-[#4f46e5]',
		metaSeparator: 'mx-2 text-[#c7d2fe]',
		reviewDate: 'whitespace-nowrap',
		metaRight: 'whitespace-nowrap',
		readButton:
			'text-[13px] font-medium text-[#6366f1] whitespace-nowrap underline hover:text-[#4338ca]',
	},

	// Nested: shared review content — violet-tinted background
	PkpOpenReviewReviewContent: {
		reviewerDetails: 'flex flex-col items-start gap-1 mb-3',
		reviewerDetailName: 'font-semibold text-[15px] text-[#312e81]',
		reviewerDetailAffiliation: 'text-[0.875rem] text-[#334155]',
		reviewerDetailOrcid:
			'inline-flex items-center gap-1 text-[13px] text-[#6366f1] no-underline hover:underline',
		reviewerDetailOrcidIcon: 'w-4 h-4',
		label:
			'text-[0.75rem] font-semibold uppercase tracking-wider text-[#6366f1] mb-3',
		content:
			'bg-[#eef2ff] border-l-2 border-l-[#c7d2fe] rounded-[0.375rem] px-6 py-5 leading-relaxed',
		comment: 'mb-4 text-[#334155] last:mb-0',
		formQuestions: 'm-0 p-0',
		formQuestion: 'mb-6 last:mb-0',
		questionText: 'block mb-2 text-[#312e81] font-semibold',
		responseText: 'mb-2 text-[#334155]',
		noContent: 'text-[#6b7280] italic m-0',
	},

	// Nested: author response content
	PkpOpenReviewAuthorResponseContent: {
		root: 'leading-relaxed text-[#334155]',
	},
};

export const StyledWithTailwind = {
	args: {
		...defaultArgs,
		styles: tailwindStyles,
	},
};

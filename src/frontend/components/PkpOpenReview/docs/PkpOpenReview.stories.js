import '@/styles/frontend-theme.css';
import PkpOpenReview from '../PkpOpenReview.vue';
import {
	mockPublicationsPeerReviews,
	mockSubmissionPeerReviewSummary,
} from './mockOpenReviewData.js';

export default {
	title: 'Frontend/PkpOpenReview/Full',
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

	// Nested: ByRound view
	PkpOpenReviewByRound: {
		root: 'flex flex-col',
		// Shadow + indigo left accent instead of full border
		roundItem:
			'border-l-[3px] border-l-[#6366f1] rounded-lg bg-[#ffffff] mt-5 first:mt-0 overflow-hidden shadow-[0_1px_3px_0_rgb(0,0,0,0.1),0_1px_2px_-1px_rgb(0,0,0,0.1)]',
		roundHeader:
			'grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-4 gap-y-2 w-full',
		roundTitle: 'text-[1rem] font-semibold text-[#4f46e5]',
		roundSummary: 'flex flex-wrap gap-4 min-w-0',
		roundSummaryItem: 'inline-flex items-center gap-1 text-[13px]',
		roundSummaryIcon: 'w-4 h-4',
		roundDate: 'text-[0.875rem] text-[#64748b] whitespace-nowrap',
		roundResponseIndicator: 'w-4 h-4 text-[#6366f1]',
		roundContent: 'px-6 pb-6',

		// Deep nesting: Accordion within ByRound
		PkpAccordionHeader: {
			trigger:
				'flex justify-between w-full px-6 py-5 bg-[#ffffff] border-none cursor-pointer items-start hover:bg-[#eef2ff]',
			content: 'flex-1',
			indicator:
				'flex shrink-0 mt-0.5 transition-transform duration-200 [[data-state=open]>&]:rotate-180',
		},

		// Deep nesting: Review items within ByRound
		PkpOpenReviewItemByRound: {
			header: 'flex items-center gap-3 w-full min-w-0',
			// Indigo separator instead of gray + decision colors
			status:
				'inline-flex items-center gap-1.5 text-[13px] pe-3 border-e-2 border-e-[#c7d2fe] whitespace-nowrap data-[recommendation=approved]:text-[#059669] data-[recommendation=revisionsRequested]:text-[#d97706] data-[recommendation=notApproved]:text-[#e11d48] data-[recommendation=withComments]:text-[#6366f1]',
			statusIcon: 'w-[1.125rem] h-[1.125rem]',
			reviewer: 'font-semibold text-[15px] text-[#4f46e5]',
			affiliation:
				'flex-1 min-w-0 text-[0.875rem] text-[#64748b] overflow-hidden text-ellipsis whitespace-nowrap',
			date: 'text-[0.875rem] text-[#64748b] whitespace-nowrap',

			PkpAccordionHeader: {
				trigger:
					'flex items-center justify-between py-4 px-0 w-full text-start bg-transparent border-none cursor-pointer hover:bg-[#eef2ff]',
				content: 'min-w-0',
				indicator:
					'flex shrink-0 transition-transform duration-200 [[data-state=open]>&]:rotate-180',
			},
		},

		// Deep nesting: Author response — indigo-tinted background
		PkpOpenReviewItemAuthorResponse: {
			root: 'border-l-[3px] border-l-[#6366f1] rounded-lg bg-[#eef2ff] overflow-hidden mb-4 shadow-[0_1px_2px_0_rgb(0,0,0,0.05)]',
			header: 'flex items-center gap-3 flex-1',
			label: 'font-semibold text-[15px] text-[#4f46e5]',
			readButton:
				'text-[13px] font-medium text-[#6366f1] whitespace-nowrap underline hover:text-[#4338ca]',
			content: 'px-6 py-5 leading-relaxed',

			PkpAccordionHeader: {
				trigger:
					'flex items-center justify-between py-4 px-5 w-full bg-transparent border-none cursor-pointer hover:bg-[#e0e7ff]',
				indicator: 'flex shrink-0',
			},
		},
	},

	// Nested: ByReviewer view
	PkpOpenReviewByReviewer: {
		root: 'flex flex-col',
		// Shadow + indigo left accent
		reviewerItem:
			'border-l-[3px] border-l-[#6366f1] rounded-lg bg-[#ffffff] mt-5 first:mt-0 overflow-hidden shadow-[0_1px_3px_0_rgb(0,0,0,0.1),0_1px_2px_-1px_rgb(0,0,0,0.1)]',
		reviewerHeader: 'flex flex-col gap-1 w-full text-start',
		reviewerTitle: 'text-[1rem] font-semibold text-[#4f46e5]',
		reviewerAffiliation:
			'text-[0.875rem] text-[#64748b] overflow-hidden text-ellipsis whitespace-nowrap',
		reviewerContent: 'px-6 pb-6',

		PkpAccordionHeader: {
			trigger:
				'flex justify-between w-full px-6 py-5 bg-[#ffffff] border-none cursor-pointer items-start hover:bg-[#eef2ff]',
			content: 'flex-1',
			indicator:
				'flex shrink-0 mt-0.5 transition-transform duration-200 [[data-state=open]>&]:rotate-180',
		},

		PkpOpenReviewItemByReviewer: {
			header: 'flex items-center gap-3 w-full min-w-0',
			// Indigo separator + decision colors
			status:
				'inline-flex items-center gap-1.5 text-[13px] pe-3 border-e-2 border-e-[#c7d2fe] whitespace-nowrap data-[recommendation=approved]:text-[#059669] data-[recommendation=revisionsRequested]:text-[#d97706] data-[recommendation=notApproved]:text-[#e11d48] data-[recommendation=withComments]:text-[#6366f1]',
			statusIcon: 'w-[1.125rem] h-[1.125rem]',
			version: 'font-semibold text-[15px] text-[#4f46e5]',
			date: 'text-[0.875rem] text-[#64748b] whitespace-nowrap',

			PkpAccordionHeader: {
				trigger:
					'flex items-center justify-between py-4 px-0 w-full text-start bg-transparent border-none cursor-pointer hover:bg-[#eef2ff]',
				content: 'min-w-0',
				indicator:
					'flex shrink-0 transition-transform duration-200 [[data-state=open]>&]:rotate-180',
			},
		},
	},

	// Nested: Shared review content — violet-tinted background
	PkpOpenReviewItemContent: {
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
};

export const StyledWithTailwind = {
	args: {
		...defaultArgs,
		styles: tailwindStyles,
	},
};

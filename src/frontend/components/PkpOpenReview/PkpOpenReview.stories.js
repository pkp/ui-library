import PkpOpenReview from './PkpOpenReview.vue';
import '../../../styles/_frontend-theme.less';

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
	parameters: {
		docs: {
			description: {
				component: `
## PkpOpenReview Component

Displays peer review information for published articles with two view modes: by record (version) and by reviewer.

Reviews are displayed in expandable accordions - clicking a review row expands it inline to show the review content.

### Available Slots

| Slot | Scope Props | Purpose |
|------|-------------|---------|
| \`roundHeader\` | \`{ round, summary, reviewCount }\` | Customize round accordion header in "By Record" view |
| \`reviewItem\` | \`{ review, round }\` | Customize review item header in "By Record" view |
| \`reviewerHeader\` | \`{ reviewer, reviewCount }\` | Customize reviewer accordion header in "By Reviewer" view |
| \`reviewerItem\` | \`{ review, reviewer }\` | Customize review item header in "By Reviewer" view |
`,
			},
		},
	},
};

const defaultArgs = {
	publicationsPeerReviews: [
		{
			publicationId: 5,
			reviewRounds: [
				{
					displayText: 'Version of Record 6',
					date: '2025-10-15 00:00:00',
					roundId: 6,
					reviews: [
						{
							id: 601,
							reviewerId: 101,
							reviewerFullName: 'Dr. Elaine Morris',
							reviewerAffiliation:
								'University of Oxford, Department of Biochemistry, United Kingdom',
							dateAssigned: '2025-10-01 09:00:00',
							dateConfirmed: '2025-10-02 10:30:00',
							dateCompleted: '2025-10-10 14:20:00',
							declined: false,
							reviewerRecommendationTypeId: 1,
							reviewerRecommendationTypeLabel: 'Approved',
							reviewerRecommendationDisplayText: 'Approved',
							reviewerComments: [
								'This is an excellent manuscript that makes a significant contribution to the field. The methodology is sound and the conclusions are well-supported by the data.',
								'I particularly appreciated the thorough literature review and the clear presentation of the experimental design.',
							],
						},
						{
							id: 602,
							reviewerId: 102,
							reviewerFullName: 'Dr. Li Wei',
							reviewerAffiliation:
								'National University of Singapore, Department of Biological Sciences, Singapore',
							dateAssigned: '2025-10-01 09:00:00',
							dateConfirmed: '2025-10-03 08:15:00',
							dateCompleted: '2025-10-12 16:45:00',
							declined: false,
							reviewerRecommendationTypeId: 3,
							reviewerRecommendationTypeLabel: 'Revisions Requested',
							reviewerRecommendationDisplayText: 'Revisions Requested',
							reviewForm: {
								questions: [
									{
										question: 'Is the research methodology appropriate?',
										responses: [
											'The methodology is generally appropriate, but I have some concerns about the sample size used in the study.',
										],
									},
									{
										question:
											'Are the conclusions supported by the evidence presented?',
										responses: [
											'The conclusions need to be tempered in light of the limitations mentioned above.',
											'Additional statistical analysis would strengthen the claims.',
										],
									},
								],
							},
						},
						{
							id: 603,
							reviewerId: 103,
							reviewerFullName: 'Dr. Arjun Patel',
							reviewerAffiliation:
								'University of Toronto, Department of Molecular Genetics, Canada',
							dateAssigned: '2025-10-01 09:00:00',
							dateConfirmed: '2025-10-02 14:00:00',
							dateCompleted: '2025-10-11 11:30:00',
							declined: false,
							reviewerRecommendationTypeId: 3,
							reviewerRecommendationTypeLabel: 'Revisions Requested',
							reviewerRecommendationDisplayText: 'Revisions Requested',
							reviewerComments: [
								'The paper presents interesting findings but requires some revisions before publication. Please address the following points:',
								'1. The introduction could benefit from additional context about prior work in this area.',
								'2. Figure 3 needs higher resolution and clearer labeling.',
								'3. The discussion section should address potential limitations of the study.',
							],
						},
						{
							id: 604,
							reviewerId: 104,
							reviewerFullName: 'Dr. Sofia Rodriguez',
							reviewerAffiliation:
								'University of Lisbon, Faculty of Sciences, Portugal',
							dateAssigned: '2025-10-01 09:00:00',
							dateConfirmed: '2025-10-04 09:45:00',
							dateCompleted: '2025-10-13 10:00:00',
							declined: false,
							reviewerRecommendationTypeId: 2,
							reviewerRecommendationTypeLabel: 'Not Approved',
							reviewerRecommendationDisplayText: 'Not Approved',
							reviewerComments: [
								'I regret that I cannot recommend this manuscript for publication in its current form. There are significant methodological issues that need to be addressed.',
							],
						},
					],
				},
				{
					displayText: 'Version of Record 5',
					date: '2025-07-20 00:00:00',
					roundId: 5,
					reviews: [
						{
							id: 501,
							reviewerId: 101,
							reviewerFullName: 'Dr. Elaine Morris',
							reviewerAffiliation:
								'University of Oxford, Department of Biochemistry, United Kingdom',
							dateAssigned: '2025-07-01 09:00:00',
							dateConfirmed: '2025-07-02 10:30:00',
							dateCompleted: '2025-07-10 14:20:00',
							declined: false,
							reviewerRecommendationTypeId: 3,
							reviewerRecommendationTypeLabel: 'Revisions Requested',
							reviewerRecommendationDisplayText: 'Revisions Requested',
							reviewerComments: [
								'The authors have made good progress on this revision, but some issues remain.',
							],
						},
						{
							id: 502,
							reviewerId: 102,
							reviewerFullName: 'Dr. Li Wei',
							reviewerAffiliation:
								'National University of Singapore, Department of Biological Sciences, Singapore',
							dateAssigned: '2025-07-01 09:00:00',
							dateConfirmed: '2025-07-03 08:15:00',
							dateCompleted: '2025-07-12 16:45:00',
							declined: false,
							reviewerRecommendationTypeId: 3,
							reviewerRecommendationTypeLabel: 'Revisions Requested',
							reviewerRecommendationDisplayText: 'Revisions Requested',
						},
						{
							id: 503,
							reviewerId: 103,
							reviewerFullName: 'Dr. Arjun Patel',
							reviewerAffiliation:
								'University of Toronto, Department of Molecular Genetics, Canada',
							dateAssigned: '2025-07-01 09:00:00',
							dateConfirmed: '2025-07-02 14:00:00',
							dateCompleted: '2025-07-11 11:30:00',
							declined: false,
							reviewerRecommendationTypeId: 4,
							reviewerRecommendationTypeLabel: 'With Comments',
							reviewerRecommendationDisplayText: 'Comments',
							reviewerComments: ['Minor comments for the authors to consider.'],
						},
						{
							id: 504,
							reviewerId: 104,
							reviewerFullName: 'Dr. Sofia Rodriguez',
							reviewerAffiliation:
								'University of Lisbon, Faculty of Sciences, Portugal',
							dateAssigned: '2025-07-01 09:00:00',
							dateConfirmed: '2025-07-04 09:45:00',
							dateCompleted: '2025-07-13 10:00:00',
							declined: false,
							reviewerRecommendationTypeId: 2,
							reviewerRecommendationTypeLabel: 'Not Approved',
							reviewerRecommendationDisplayText: 'Not Approved',
						},
					],
				},
				{
					displayText: 'Version of Record 4',
					date: '2024-03-10 00:00:00',
					roundId: 4,
					reviews: [
						{
							id: 401,
							reviewerId: 101,
							reviewerFullName: 'Dr. Elaine Morris',
							reviewerAffiliation:
								'University of Oxford, Department of Biochemistry, United Kingdom',
							dateAssigned: '2024-03-01 09:00:00',
							dateConfirmed: '2024-03-02 10:30:00',
							dateCompleted: '2024-03-10 14:20:00',
							declined: false,
							reviewerRecommendationTypeId: 3,
							reviewerRecommendationTypeLabel: 'Revisions Requested',
							reviewerRecommendationDisplayText: 'Revisions Requested',
						},
						{
							id: 402,
							reviewerId: 102,
							reviewerFullName: 'Dr. Li Wei',
							reviewerAffiliation:
								'National University of Singapore, Department of Biological Sciences, Singapore',
							dateAssigned: '2024-03-01 09:00:00',
							dateConfirmed: '2024-03-03 08:15:00',
							dateCompleted: '2024-03-12 16:45:00',
							declined: false,
							reviewerRecommendationTypeId: 1,
							reviewerRecommendationTypeLabel: 'Approved',
							reviewerRecommendationDisplayText: 'Approved',
						},
						{
							id: 403,
							reviewerId: 103,
							reviewerFullName: 'Dr. Arjun Patel',
							reviewerAffiliation:
								'University of Toronto, Department of Molecular Genetics, Canada',
							dateAssigned: '2024-03-01 09:00:00',
							dateConfirmed: '2024-03-02 14:00:00',
							dateCompleted: '2024-03-11 11:30:00',
							declined: false,
							reviewerRecommendationTypeId: 3,
							reviewerRecommendationTypeLabel: 'Revisions Requested',
							reviewerRecommendationDisplayText: 'Revisions Requested',
						},
					],
				},
				{
					displayText: 'Version of Record 3',
					date: '2023-11-05 00:00:00',
					roundId: 3,
					reviews: [
						{
							id: 301,
							reviewerId: 101,
							reviewerFullName: 'Dr. Elaine Morris',
							reviewerAffiliation:
								'University of Oxford, Department of Biochemistry, United Kingdom',
							dateAssigned: '2023-11-01 09:00:00',
							dateConfirmed: '2023-11-02 10:30:00',
							dateCompleted: '2023-11-10 14:20:00',
							declined: false,
							reviewerRecommendationTypeId: 3,
							reviewerRecommendationTypeLabel: 'Revisions Requested',
							reviewerRecommendationDisplayText: 'Revisions Requested',
						},
						{
							id: 302,
							reviewerId: 102,
							reviewerFullName: 'Dr. Li Wei',
							reviewerAffiliation:
								'National University of Singapore, Department of Biological Sciences, Singapore',
							dateAssigned: '2023-11-01 09:00:00',
							dateConfirmed: '2023-11-03 08:15:00',
							dateCompleted: '2023-11-12 16:45:00',
							declined: false,
							reviewerRecommendationTypeId: 2,
							reviewerRecommendationTypeLabel: 'Not Approved',
							reviewerRecommendationDisplayText: 'Not Approved',
						},
						{
							id: 303,
							reviewerId: 104,
							reviewerFullName: 'Dr. Sofia Rodriguez',
							reviewerAffiliation:
								'University of Lisbon, Faculty of Sciences, Portugal',
							dateAssigned: '2023-11-01 09:00:00',
							dateConfirmed: '2023-11-02 14:00:00',
							dateCompleted: '2023-11-11 11:30:00',
							declined: false,
							reviewerRecommendationTypeId: 3,
							reviewerRecommendationTypeLabel: 'Revisions Requested',
							reviewerRecommendationDisplayText: 'Revisions Requested',
						},
					],
				},
			],
		},
	],
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
							<span v-for="item in summary" :key="item.typeCss" style="font-size: 12px;">
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
				<template #reviewItem="{ review }">
					<div style="display: flex; align-items: center; padding: 12px; background: #f8f9fa; border-radius: 8px; gap: 16px; width: 100%;">
						<div style="width: 40px; height: 40px; background: #e5e7eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #374151; flex-shrink: 0;">
							{{ review.reviewerFullName.charAt(0) }}
						</div>
						<div style="flex: 1; min-width: 0;">
							<div style="font-weight: 600;">{{ review.reviewerFullName }}</div>
							<div style="font-size: 12px; color: #666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ review.reviewerAffiliation }}</div>
						</div>
						<span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; flex-shrink: 0;"
								:style="{ background: review.reviewerRecommendationTypeCss === 'approved' ? '#d1fae5' : '#fef3c7' }">
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
				<template #reviewItem="{ review }">
					<span style="flex: 1;">{{ review.reviewerFullName }}</span>
					<span style="color: #666; font-size: 13px;">{{ review.reviewerRecommendationDisplayText }}</span>
				</template>
			</PkpOpenReview>
		`,
	}),
};

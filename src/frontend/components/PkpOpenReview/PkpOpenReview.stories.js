import PkpOpenReview from './PkpOpenReview.vue';

export default {
	title: 'OpenReview',
	component: PkpOpenReview,
	render: (args) => ({
		components: {PkpOpenReview},
		setup() {
			return {args};
		},
		template: '<PkpOpenReview v-bind="args"></PkpOpenReview>',
	}),
};

export const Primary = {
	args: {
		openReview: {
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
							recommendation: 'approved',
							reviewerRecommendationDisplayText: 'Approved',
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
							recommendation: 'revisions_requested',
							reviewerRecommendationDisplayText: 'Revisions Requested',
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
							recommendation: 'revisions_requested',
							reviewerRecommendationDisplayText: 'Revisions Requested',
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
							recommendation: 'not_approved',
							reviewerRecommendationDisplayText: 'Not Approved',
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
							recommendation: 'revisions_requested',
							reviewerRecommendationDisplayText: 'Revisions Requested',
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
							recommendation: 'revisions_requested',
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
							recommendation: 'comments',
							reviewerRecommendationDisplayText: 'Comments',
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
							recommendation: 'not_approved',
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
							recommendation: 'revisions_requested',
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
							recommendation: 'approved',
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
							recommendation: 'revisions_requested',
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
							recommendation: 'revisions_requested',
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
							recommendation: 'not_approved',
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
							recommendation: 'revisions_requested',
							reviewerRecommendationDisplayText: 'Revisions Requested',
						},
					],
				},
			],
		},
	},
};

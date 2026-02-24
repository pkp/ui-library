/**
 * Mock data for PkpOpenReview component development and testing.
 *
 * Based on backend ReviewRoundAuthorResponseResource.php data shape.
 */

export const mockPublicationsPeerReviews = [
	{
		publicationId: 5,
		reviewRounds: [
			{
				displayText: 'Version of Record 6',
				date: '2025-10-15 00:00:00',
				roundId: 6,
				authorResponse: {
					id: 2,
					reviewRoundId: 6,
					response: {
						en: '<p>We sincerely thank all reviewers for their thorough and constructive feedback on our revised manuscript. We have carefully addressed each concern raised:</p><p><strong>Regarding the sample size concerns (Dr. Wei):</strong> We have added a detailed power analysis in the Methods section (lines 145-152) demonstrating that our sample size of n=128 provides 85% power to detect the expected effect size based on preliminary data.</p><p><strong>Regarding Figure 3 clarity (Dr. Patel):</strong> We have completely redesigned Figure 3 with higher resolution (now 600 DPI) and clearer labeling. A color-blind friendly palette has also been implemented.</p><p><strong>Regarding limitations discussion:</strong> We have expanded the Discussion section (lines 312-328) to more thoroughly address the limitations of our study, including potential selection bias and the generalizability of our findings.</p><p>We believe these revisions have substantially strengthened the manuscript and hope the reviewers will find our responses satisfactory.</p>',
					},
					submittedByUser: {
						id: 42,
						fullName: 'Dr. Sarah Johnson',
					},
					associatedAuthors: [
						{id: 101, fullName: 'Dr. Sarah Johnson'},
						{id: 102, fullName: 'Prof. Michael Chen'},
						{id: 103, fullName: 'Dr. Emily Rodriguez'},
					],
					createdAt: '2025-10-20 14:30:00',
				},
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
					{
						id: 605,
						reviewerId: 105,
						reviewerFullName: 'Prof. Maria Kovács',
						reviewerAffiliation:
							'Eötvös Loránd University, Department of Chemistry, Hungary',
						dateAssigned: '2025-10-01 09:00:00',
						dateConfirmed: '2025-10-03 11:00:00',
						dateCompleted: '2025-10-14 09:30:00',
						declined: false,
						reviewerRecommendationTypeId: 4,
						reviewerRecommendationTypeLabel: 'With Comments',
						reviewerRecommendationDisplayText: 'Comments',
						reviewerComments: [
							'The manuscript is generally well-written. A few minor observations for the authors to consider regarding the presentation of results in Section 4.',
						],
					},
				],
			},
			{
				displayText: 'Version of Record 5',
				date: '2025-07-20 00:00:00',
				roundId: 5,
				// No author response for this round
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
				authorResponse: {
					id: 1,
					reviewRoundId: 4,
					response: {
						en: "<p>We thank the reviewers for their valuable feedback on our initial submission. We have made extensive revisions to address all concerns raised.</p><p>The key changes include: (1) expanded methodology section with additional details on data collection procedures, (2) new supplementary figures addressing visualization concerns, and (3) revised statistical analysis with appropriate corrections for multiple comparisons.</p><p>We look forward to the reviewers' assessment of these revisions.</p>",
					},
					submittedByUser: {
						id: 42,
						fullName: 'Dr. Sarah Johnson',
					},
					associatedAuthors: [
						{id: 101, fullName: 'Dr. Sarah Johnson'},
						{id: 102, fullName: 'Prof. Michael Chen'},
					],
					createdAt: '2024-03-25 09:15:00',
				},
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
						reviewerComments: [
							'The manuscript presents novel findings but requires major revisions.',
							'The methodology section lacks sufficient detail for reproducibility.',
						],
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
						reviewerComments: [
							'Excellent work with solid methodology and clear presentation.',
						],
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
						reviewerComments: [
							'Minor revisions needed before acceptance.',
							'Please clarify the statistical methods used in Table 2.',
						],
					},
				],
			},
			{
				displayText: 'Version of Record 3',
				date: '2023-11-05 00:00:00',
				roundId: 3,
				// No author response for this round
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
						reviewerComments: [
							'Initial submission shows promise but needs substantial work.',
						],
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
						reviewerComments: [
							'Cannot recommend in current form due to fundamental methodological concerns.',
						],
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
						reviewForm: {
							questions: [
								{
									question: 'Overall assessment of the manuscript',
									responses: [
										'The manuscript addresses an important topic but the execution needs improvement.',
									],
								},
								{
									question: 'Specific recommendations for improvement',
									responses: [
										'Expand the literature review to include recent publications from 2023.',
										'Provide more details on participant recruitment.',
										'Consider alternative statistical approaches.',
									],
								},
							],
						},
					},
				],
			},
			{
				displayText: 'Published Manuscript Under Review 1',
				date: '2023-06-15 00:00:00',
				roundId: 2,
				// No author response for this round
				reviews: [
					{
						id: 201,
						reviewerId: 101,
						reviewerFullName: 'Dr. Elaine Morris',
						reviewerAffiliation:
							'University of Oxford, Department of Biochemistry, United Kingdom',
						dateAssigned: '2023-06-01 09:00:00',
						dateConfirmed: '2023-06-02 10:30:00',
						dateCompleted: '2023-06-08 14:20:00',
						declined: false,
						reviewerRecommendationTypeId: 1,
						reviewerRecommendationTypeLabel: 'Approved',
						reviewerRecommendationDisplayText: 'Approved',
						reviewerComments: [
							'The manuscript is well-structured and presents compelling evidence. The experimental design is rigorous and the conclusions are well-supported.',
						],
					},
					{
						id: 202,
						reviewerId: 102,
						reviewerFullName: 'Dr. Li Wei',
						reviewerAffiliation:
							'National University of Singapore, Department of Biological Sciences, Singapore',
						dateAssigned: '2023-06-01 09:00:00',
						dateConfirmed: '2023-06-03 08:15:00',
						dateCompleted: '2023-06-10 16:45:00',
						declined: false,
						reviewerRecommendationTypeId: 2,
						reviewerRecommendationTypeLabel: 'Not Approved',
						reviewerRecommendationDisplayText: 'Not Approved',
						reviewerComments: [
							'The study has fundamental flaws in its experimental design that prevent me from recommending publication. The control group is inadequately defined.',
						],
					},
					{
						id: 203,
						reviewerId: 103,
						reviewerFullName: 'Dr. Arjun Patel',
						reviewerAffiliation:
							'University of Toronto, Department of Molecular Genetics, Canada',
						dateAssigned: '2023-06-01 09:00:00',
						dateConfirmed: '2023-06-02 14:00:00',
						dateCompleted: '2023-06-09 11:30:00',
						declined: false,
						reviewerRecommendationTypeId: 3,
						reviewerRecommendationTypeLabel: 'Revisions Requested',
						reviewerRecommendationDisplayText: 'Revisions Requested',
						reviewerComments: [
							'The core findings are interesting but the manuscript needs revisions before it is ready for publication.',
							'Please provide additional detail on the data analysis pipeline and address the inconsistencies in Table 1.',
						],
					},
					{
						id: 204,
						reviewerId: 104,
						reviewerFullName: 'Dr. Sofia Rodriguez',
						reviewerAffiliation:
							'University of Lisbon, Faculty of Sciences, Portugal',
						dateAssigned: '2023-06-01 09:00:00',
						dateConfirmed: '2023-06-04 09:45:00',
						dateCompleted: '2023-06-11 10:00:00',
						declined: false,
						reviewerRecommendationTypeId: 4,
						reviewerRecommendationTypeLabel: 'With Comments',
						reviewerRecommendationDisplayText: 'Comments',
						reviewerComments: [
							'A solid contribution with minor points for the authors to consider. The writing is clear and the figures are informative.',
						],
					},
				],
			},
		],
	},
];

export const mockSubmissionPeerReviewSummary = {
	reviewerCount: 6,
	reviewerRecommendations: [
		{
			recommendationTypeId: 1,
			recommendationTypeLabel: 'Approved',
			count: 1,
		},
		{
			recommendationTypeId: 3,
			recommendationTypeLabel: 'Revisions Requested',
			count: 3,
		},
		{
			recommendationTypeId: 2,
			recommendationTypeLabel: 'Not Approved',
			count: 2,
		},
	],
	submissionPublishedVersionsCount: 5,
	submissionCurrentVersion: {
		versionString: 'Version of Record 2',
		datePublished: '2025-11-01 00:00:00',
	},
};

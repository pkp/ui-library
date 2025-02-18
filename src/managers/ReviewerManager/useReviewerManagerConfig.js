import {useLocalize} from '@/composables/useLocalize';
import {useDate} from '@/composables/useDate';
import {RecommendationTranslations} from '@/composables/useSubmission';
export function useReviewerManagerConfig() {
	const {t} = useLocalize();
	const {formatShortDate} = useDate();

	function getCellStatusItems({reviewAssignment}) {
		const items = [];

		function getRecommendationString(reviewAssignment) {
			const recommendationString = reviewAssignment.recommendation
				? t(RecommendationTranslations[reviewAssignment.recommendation])
				: null;

			if (recommendationString) {
				return t('submission.recommendation', {
					recommendation: recommendationString,
				});
			}

			return null;
		}

		function getCompetingInterests(reviewAssignment) {
			if (reviewAssignment.competingInterests?.length) {
				return t('reviewer.competingInterests');
			}
		}

		switch (reviewAssignment.statusId) {
			case pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE:
				items.push({
					component: 'ReviewerManagerCellStatusInfo',
					props: {
						title: t('editor.review.requestSent'),
						message: t('editor.review.responseDue', {
							date: formatShortDate(reviewAssignment.dateResponseDue),
						}),
						competingInterests: getCompetingInterests(reviewAssignment),
					},
				});
				break;

			case pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED:
				items.push({
					component: 'ReviewerManagerCellStatusInfo',
					props: {
						title: t('editor.review.requestAccepted'),
						description: t('editor.review.reviewDue', {
							date: formatShortDate(reviewAssignment.dateDue),
						}),
						competingInterests: getCompetingInterests(reviewAssignment),
					},
				});
				break;
			case pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE:
				items.push({
					component: 'ReviewerManagerCellStatusInfo',
					props: {
						title: t('common.complete'),
						recommendation: getRecommendationString(reviewAssignment),
						competingInterests: getCompetingInterests(reviewAssignment),
					},
				});
				break;
			case pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE:
				items.push({
					component: 'ReviewerManagerCellStatusInfo',
					props: {
						title: t('common.overdue'),
						isNegative: true,
						description: t('editor.review.reviewDue', {
							date: formatShortDate(reviewAssignment.dateDue),
						}),
						competingInterests: getCompetingInterests(reviewAssignment),
					},
				});
				break;

			case pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE:
				items.push({
					component: 'ReviewerManagerCellStatusInfo',
					props: {
						title: t('common.overdue'),
						isNegative: true,
						description: t('editor.review.responseDue', {
							date: formatShortDate(reviewAssignment.dateResponseDue),
						}),
						competingInterests: getCompetingInterests(reviewAssignment),
					},
				});
				break;

			case pkp.const.REVIEW_ASSIGNMENT_STATUS_DECLINED:
				items.push({
					component: 'ReviewerManagerCellStatusInfo',
					props: {
						title: t('editor.review.requestDeclined'),
						tooltip: t('editor.review.requestDeclined.tooltip'),
						competingInterests: getCompetingInterests(reviewAssignment),
					},
				});
				break;

			case pkp.const.REVIEW_ASSIGNMENT_STATUS_CANCELLED:
				items.push({
					component: 'ReviewerManagerCellStatusInfo',
					props: {
						title: t('editor.review.requestCancelled'),
						tooltip: t('editor.review.requestCancelled.tooltip'),
						competingInterests: getCompetingInterests(reviewAssignment),
					},
				});
				break;

			case pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED:
				items.push({
					component: 'ReviewerManagerCellStatusInfo',
					props: {
						title: t('editor.review.reviewSubmitted'),
						recommendation: getRecommendationString(reviewAssignment),
						competingInterests: getCompetingInterests(reviewAssignment),
					},
				});
				break;

			case pkp.const.REVIEW_ASSIGNMENT_STATUS_THANKED:
				items.push({
					component: 'ReviewerManagerCellStatusInfo',
					props: {
						title: t('editor.review.reviewerThanked'),
						recommendation: getRecommendationString(reviewAssignment),
						competingInterests: getCompetingInterests(reviewAssignment),
					},
				});
				break;

			case pkp.const.REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND:
				items.push({
					component: 'ReviewerManagerCellStatusInfo',
					props: {
						title: t('editor.review.ReviewerResendRequest'),
						description: t('editor.review.responseDue', {
							date: formatShortDate(reviewAssignment.dateDue),
						}),
						competingInterests: getCompetingInterests(reviewAssignment),
					},
				});
				break;
			case pkp.const.REVIEW_ASSIGNMENT_STATUS_VIEWED:
				items.push({
					component: 'ReviewerManagerCellStatusInfo',
					props: {
						title: t('editor.review.reviewViewed'),
						competingInterests: getCompetingInterests(reviewAssignment),
					},
				});
				break;

			default:
		}

		return items;
	}

	function getColumns({submission, redactedForAuthors}) {
		const columns = [];

		const props = {submission, redactedForAuthors};

		columns.push({
			header: t('user.role.reviewer'),
			component: 'ReviewerManagerCellReviewer',
			props,
		});

		if (!redactedForAuthors) {
			columns.push({
				header: t('reviewerManager.reviewerStatus'),
				component: 'ReviewerManagerCellStatus',
				props,
			});
		}

		columns.push({
			header: t('common.type'),
			component: 'ReviewerManagerCellReviewType',
			props,
		});

		columns.push({
			header: t('grid.columns.actions'),
			component: 'ReviewerManagerCellPrimaryActions',
			props,
		});

		if (!redactedForAuthors) {
			columns.push({
				header: t('common.moreActions'),
				headerSrOnly: true,
				component: 'ReviewerManagerCellActions',
				props,
			});
		}

		return columns;
	}

	return {getCellStatusItems, getColumns};
}

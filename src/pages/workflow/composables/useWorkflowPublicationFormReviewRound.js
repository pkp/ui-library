import {useLocalize} from '@/composables/useLocalize';
import {useForm} from '@/composables/useForm';
import {useSubmission} from '@/composables/useSubmission';
import {formatShortDate} from '@/utils/dateUtils';

/**
 * Adds the "Associated review round" multi-select field to a form.
 *
 * Mirrors useWorkflowPublicationFormIssue: it injects the field client-side so the
 * same control can be reused on the publication Issue tab form and on the
 * client-side version form.
 *
 * @param {object} form The form ref (as accepted by useForm)
 * @param {object} deps
 * @param {object} deps.submission The submission (provides reviewRounds + reviewAssignments)
 * @param {object} deps.selectedPublication The publication the rounds are scoped to
 * @param {object} [options]
 * @param {string} [options.groupId] The form group the field belongs to (defaults to 'default')
 * @param {string} [options.positionAfter] Forwarded to useForm().addField (also positionBefore/override)
 */
export function useWorkflowPublicationFormReviewRound(
	form,
	{submission, selectedPublication},
	{groupId = 'default', ...options} = {},
) {
	const {t} = useLocalize();
	const {addField, getField} = useForm(form);
	const {getReviewAssignmentsForRound} = useSubmission();

	function getRoundOpenedDate(round) {
		const dates = getReviewAssignmentsForRound(
			submission?.reviewAssignments ?? [],
			round.id,
		)
			.map((reviewAssignment) => reviewAssignment.dateAssigned)
			.filter(Boolean)
			.sort(); // YYYY-MM-DD sorts lexicographically === chronologically

		return dates.length ? formatShortDate(dates[0]) : null;
	}

	function initialize() {
		if (getField('reviewRoundIds')) {
			return; // idempotent
		}

		const currentPublicationId = selectedPublication?.id ?? null;
		const reviewRounds = submission?.reviewRounds ?? [];

		const reviewRoundOptions = reviewRounds.map((round) => {
			const date = getRoundOpenedDate(round);

			return {
				value: round.id,
				label: date
					? t('publication.reviewRound.option', {
							round: round.round,
							date,
						})
					: t('publication.reviewRound.optionNoDate', {
							round: round.round,
						}),
				// Locked when associated with a different publication/version
				disabled:
					!!round.publicationId && round.publicationId !== currentPublicationId,
			};
		});

		const value = reviewRounds
			.filter((round) => round.publicationId === currentPublicationId)
			.map((round) => round.id);

		addField(
			'reviewRoundIds',
			{
				component: 'field-multi-select',
				label: t('publication.reviewRound.field.label'),
				description: t('publication.reviewRound.field.description'),
				placeholder: t('publication.reviewRound.field.placeholder'),
				options: reviewRoundOptions,
				value,
				groupId,
			},
			options,
		);
	}

	return {initialize};
}

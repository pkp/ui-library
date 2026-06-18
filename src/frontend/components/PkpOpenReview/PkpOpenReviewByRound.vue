<template>
	<div :class="cn('root')">
		<section
			v-for="round in store.reviewRoundsDisplay"
			:key="round.roundId"
			:class="cn('roundItem')"
		>
			<div :class="cn('roundHeader')">
				<slot
					name="roundHeader"
					:round="round"
					:review-count="round.reviews?.length || 0"
					:heading-level="store.headingLevel"
				>
					<component :is="`h${store.headingLevel}`" :class="cn('roundHeading')">
						<span :class="cn('roundNumber')">
							{{ t('openReview.roundNumber', {number: round.roundNumber}) }}
						</span>
						<span :class="cn('roundVersion')">
							{{ round.versionString || round.displayText }}
						</span>
					</component>
					<span :class="cn('roundStatus')" :data-status="round.status">
						<span :class="cn('roundStatusLabel')">
							{{ t('openReview.status') }}
						</span>
						<span :class="cn('roundStatusValue')">
							{{ roundStatusLabel(round) }}
						</span>
					</span>
				</slot>
			</div>

			<!-- Unified accordion for reviews + author response -->
			<PkpAccordionRoot
				:model-value="store.expandedContentIds"
				type="multiple"
				:class="cn('roundContent')"
				@update:model-value="store.setExpandedContent"
			>
				<!-- Review items -->
				<PkpAccordionItem
					v-for="review in round.reviews"
					:key="review.id"
					:value="String(review.id)"
					:data-review-id="review.id"
					:class="cn('reviewItem')"
				>
					<PkpAccordionHeader :as="`h${store.headingLevel + 1}`">
						<slot name="reviewHeader" :review="review" :round="round">
							<span :class="cn('reviewHeader')">
								<span
									:class="cn('reviewStatus')"
									:data-recommendation="review.reviewerRecommendationTypeKey"
								>
									<PkpIcon
										:icon="review.reviewerRecommendationTypeIcon"
										:class="cn('reviewStatusIcon')"
										aria-hidden="true"
									/>
								</span>
								<span :class="cn('reviewHeaderText')">
									<span :class="cn('reviewStatusText')">
										{{ review.reviewerRecommendationDisplayText }}
									</span>
									<span :class="cn('reviewHeaderMeta')">
										<span :class="cn('reviewer')">
											{{ review.reviewerFullName }}
										</span>
										<template v-if="review.dateCompleted">
											<span :class="cn('metaSeparator')" aria-hidden="true">
												|
											</span>
											<span :class="cn('reviewDate')">
												{{
													t('openReview.reviewDate', {
														date: formatLongDate(review.dateCompleted),
													})
												}}
											</span>
										</template>
									</span>
								</span>
							</span>
						</slot>
						<template #indicator="{open}">
							<span :class="cn('metaRight')">
								<span :class="cn('readButton')">
									{{
										open
											? t('openReview.hideReview')
											: t('openReview.readReview')
									}}
								</span>
							</span>
						</template>
					</PkpAccordionHeader>

					<PkpAccordionContent>
						<slot name="reviewDetails" :review="review" :round="round">
							<PkpOpenReviewReviewDetails :review="review" />
						</slot>
						<slot name="reviewContent" :review="review" :round="round">
							<PkpOpenReviewReviewContent :review="review" />
						</slot>
					</PkpAccordionContent>
				</PkpAccordionItem>

				<!-- Author Response (last item when present) -->
				<PkpAccordionItem
					v-if="round.authorResponse"
					:value="`response-${round.roundId}`"
					:class="cn('authorResponseItem')"
				>
					<PkpAccordionHeader :as="`h${store.headingLevel + 1}`">
						<slot
							name="authorResponseHeader"
							:round="round"
							:author-response="round.authorResponse"
						>
							<span :class="cn('authorResponseHeader')">
								<span :class="cn('authorResponseStatus')">
									<PkpIcon
										icon="ReviewAuthorResponse"
										:class="cn('authorResponseIcon')"
										aria-hidden="true"
									/>
								</span>
								<span :class="cn('authorResponseHeaderText')">
									<span :class="cn('authorResponseLabel')">
										{{ t('submission.reviewRound.authorResponse') }}
									</span>
									<span :class="cn('authorResponseHeaderMeta')">
										<span
											v-if="authorNames(round.authorResponse)"
											:class="cn('authorResponseAuthors')"
										>
											{{ authorNames(round.authorResponse) }}
										</span>
										<span
											v-if="
												authorNames(round.authorResponse) &&
												round.authorResponse.createdAt
											"
											:class="cn('metaSeparator')"
											aria-hidden="true"
										>
											|
										</span>
										<span
											v-if="round.authorResponse.createdAt"
											:class="cn('authorResponseDate')"
										>
											{{ formatLongDate(round.authorResponse.createdAt) }}
										</span>
									</span>
								</span>
							</span>
						</slot>
						<template #indicator="{open}">
							<span :class="cn('metaRight')">
								<span :class="cn('readButton')">
									{{
										open
											? t('openReview.hideResponse')
											: t('openReview.readResponse')
									}}
								</span>
							</span>
						</template>
					</PkpAccordionHeader>

					<PkpAccordionContent>
						<slot
							name="authorResponseDetails"
							:round="round"
							:author-response="round.authorResponse"
						>
							<PkpOpenReviewAuthorResponseDetails
								:author-response="round.authorResponse"
							/>
						</slot>
						<slot
							name="authorResponseContent"
							:round="round"
							:author-response="round.authorResponse"
						>
							<PkpOpenReviewAuthorResponseContent
								:author-response="round.authorResponse"
							/>
						</slot>
					</PkpAccordionContent>
				</PkpAccordionItem>
			</PkpAccordionRoot>
		</section>
	</div>
</template>

<script setup>
import PkpAccordionRoot from '@/frontend/components/PkpAccordion/PkpAccordionRoot.vue';
import PkpAccordionItem from '@/frontend/components/PkpAccordion/PkpAccordionItem.vue';
import PkpAccordionHeader from '@/frontend/components/PkpAccordion/PkpAccordionHeader.vue';
import PkpAccordionContent from '@/frontend/components/PkpAccordion/PkpAccordionContent.vue';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import PkpOpenReviewReviewDetails from './PkpOpenReviewReviewDetails.vue';
import PkpOpenReviewReviewContent from './PkpOpenReviewReviewContent.vue';
import PkpOpenReviewAuthorResponseDetails from './PkpOpenReviewAuthorResponseDetails.vue';
import PkpOpenReviewAuthorResponseContent from './PkpOpenReviewAuthorResponseContent.vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpDate} from '@/frontend/composables/usePkpDate';
import {usePkpOpenReviewStore} from './usePkpOpenReviewStore';

const props = defineProps({
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviewByRound', props.styles);
const store = usePkpOpenReviewStore();
const {t} = usePkpLocalize();
const {formatLongDate} = usePkpDate();

/**
 * Localized label for a round's public review status
 * @param {Object} round - The round object (status: 'complete' | 'inProgress' | 'notStarted')
 * @returns {string}
 */
function roundStatusLabel(round) {
	if (round.status === 'complete') {
		return t('openReview.roundStatusCompleted');
	}
	return t('openReview.roundStatusInProgress');
}

/**
 * Comma-separated list of the authors associated with a response
 * @param {Object} authorResponse
 * @returns {string}
 */
function authorNames(authorResponse) {
	const authors = authorResponse?.associatedAuthors || [];
	const names = authors.map((a) => a.fullName).filter(Boolean);
	if (names.length) {
		return names.join(', ');
	}
	return authorResponse?.submittedByUser?.fullName || '';
}
</script>

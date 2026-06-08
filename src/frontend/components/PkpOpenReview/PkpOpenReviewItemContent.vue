<template>
	<slot :review="review">
		<div
			v-if="review.reviewerAffiliation || review.reviewerOrcid"
			:class="cn('reviewerDetails')"
		>
			<span
				v-if="review.reviewerAffiliation"
				:class="cn('reviewerDetailAffiliation')"
			>
				{{ review.reviewerAffiliation }}
			</span>
			<a
				v-if="review.reviewerOrcid"
				:href="review.reviewerOrcid"
				target="_blank"
				rel="noopener noreferrer"
				:class="cn('reviewerDetailOrcid')"
			>
				<PkpIcon
					:icon="
						review.reviewerHasVerifiedOrcid ? 'Orcid' : 'OrcidUnauthenticated'
					"
					:class="cn('reviewerDetailOrcidIcon')"
					aria-hidden="true"
				/>
				<span>{{ orcidCompact(review.reviewerOrcid) }}</span>
			</a>
		</div>
		<component :is="`h${store.headingLevel + 2}`" :class="cn('label')">
			{{ t('submission.review') }}
		</component>
		<div :class="cn('content')">
			<!-- Comments -->
			<template v-if="review.reviewerComments?.length">
				<p
					v-for="(comment, i) in review.reviewerComments"
					:key="i"
					v-strip-unsafe-html="comment"
					:class="cn('comment')"
				></p>
			</template>

			<!-- Form responses -->
			<template v-else-if="review.reviewForm?.questions?.length">
				<dl :class="cn('formQuestions')">
					<div
						v-for="(question, i) in review.reviewForm.questions"
						:key="i"
						:class="cn('formQuestion')"
					>
						<dt
							v-strip-unsafe-html="question.question"
							:class="cn('questionText')"
						></dt>
						<dd
							v-for="(response, j) in question.responses"
							:key="j"
							v-strip-unsafe-html="response"
							:class="cn('responseText')"
						></dd>
					</div>
				</dl>
			</template>

			<!-- No content -->
			<template v-else>
				<p :class="cn('noContent')">
					{{ t('openReview.noCommentsAvailable') }}
				</p>
			</template>
		</div>
	</slot>
</template>

<script setup>
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpOpenReviewStore} from './usePkpOpenReviewStore';

const props = defineProps({
	review: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviewItemContent', props.styles);
const {t} = usePkpLocalize();
const store = usePkpOpenReviewStore();

/**
 * Strip the orcid.org URL prefix to show just the iD digits
 * @param {string} orcid - Full ORCID URL
 * @returns {string}
 */
function orcidCompact(orcid) {
	return orcid ? orcid.replace(/^https?:\/\/(www\.)?orcid\.org\//, '') : '';
}
</script>

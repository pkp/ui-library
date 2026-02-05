<template>
	<slot :review="review">
		<div :class="cn('label')">{{ t('submission.review') }}</div>
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
			<template v-else-if="review.reviewForm">
				<div
					v-for="(question, i) in review.reviewForm.questions"
					:key="i"
					:class="cn('formQuestion')"
				>
					<strong
						v-strip-unsafe-html="question.question"
						:class="cn('questionText')"
					></strong>
					<p
						v-for="(response, j) in question.responses"
						:key="j"
						v-strip-unsafe-html="response"
						:class="cn('responseText')"
					></p>
				</div>
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
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';

const props = defineProps({
	review: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviewItemContent', props.styles);
const {t} = usePkpLocalize();
</script>

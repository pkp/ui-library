<template>
	<slot :review="review">
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
</script>

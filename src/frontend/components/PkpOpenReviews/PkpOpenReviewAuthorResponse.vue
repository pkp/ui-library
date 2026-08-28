<template>
	<PkpAccordionItem :value="`author${String(round)}`" :class="cn('root')">
		<article :class="cn('wrapper')">
			<PkpOpenReviewAccordianHeader
				:title="t('submission.reviewRound.authorResponse')"
				:subtitle="authorList"
				:open-label="t('openReview.readResponse')"
				:close-label="t('openReview.hideResponse')"
				:-review-icon="Comments"
			/>
			<PkpAccordionContent>
				<div :class="cn('content')">
					<time v-if="date" :class="cn('date')">
						{{ formatLongDate(date) }}
					</time>
					<h3 :class="cn('authors')">
						<span
							v-for="author in authors"
							:key="author.id"
							:class="cn('author')"
						>
							<span :class="cn('author-name')">
								{{ author.fullName }}
							</span>
							<PkpOrcidDisplay
								:class="cn('author-orcid')"
								:orcid-url="author.orcid"
								:is-verified="author.hasVerifiedOrcid"
								variant="icon"
							/>
						</span>
					</h3>
					<section
						:class="cn('response')"
						:aria-label="t('submission.reviewRound.authorResponse')"
					>
						<h4 class="sr-only">
							{{ t('submission.reviewRound.authorResponse') }}
						</h4>
						<div
							v-strip-unsafe-html="localize(response)"
							:class="cn('response-text')"
						/>
					</section>
				</div>
			</PkpAccordionContent>
		</article>
	</PkpAccordionItem>
</template>

<script setup>
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import PkpAccordionItem from '../PkpAccordion/PkpAccordionItem.vue';
import PkpAccordionContent from '../PkpAccordion/PkpAccordionContent.vue';
import Comments from './icons/Comments.vue';
import {formatLongDate} from '@/utils/dateUtils';
import PkpOrcidDisplay from '../PkpOrcidDisplay/PkpOrcidDisplay.vue';
import PkpOpenReviewAccordianHeader from './PkpOpenReviewAccordianHeader.vue';
import {computed} from 'vue';

const props = defineProps({
	round: {type: Number, required: true},
	response: {type: Object, required: true},
	authors: {type: Array, required: true},
	date: {type: String, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviewAuthorResponse', props.styles);
const {t, localize} = usePkpLocalize();

const authorList = computed(() => {
	return props.authors
		.map((author) => author.fullName)
		.join(t('common.commaListSeparator'));
});
</script>

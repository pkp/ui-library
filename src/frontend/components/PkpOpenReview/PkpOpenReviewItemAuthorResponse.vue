<template>
	<PkpAccordionItem :value="`response-${roundId}`" :class="cn('root')">
		<PkpAccordionHeader :as="`h${store.headingLevel + 1}`">
			<slot name="header" :round-id="roundId" :author-response="authorResponse">
				<span :class="cn('header')">
					<span :class="cn('status')">
						<PkpIcon
							icon="ReviewAuthorResponse"
							:class="cn('statusIcon')"
							aria-hidden="true"
						/>
					</span>
					<span :class="cn('headerText')">
						<span :class="cn('label')">
							{{ t('submission.reviewRound.authorResponse') }}
						</span>
						<span :class="cn('headerMeta')">
							<span v-if="authorNames" :class="cn('authors')">
								{{ authorNames }}
							</span>
							<span
								v-if="authorNames && authorResponse.createdAt"
								:class="cn('metaSeparator')"
								aria-hidden="true"
							>
								|
							</span>
							<span v-if="authorResponse.createdAt" :class="cn('date')">
								{{ formatLongDate(authorResponse.createdAt) }}
							</span>
						</span>
					</span>
				</span>
			</slot>
			<template #indicator="{open}">
				<span :class="cn('metaRight')">
					<span :class="cn('readButton')">
						{{
							open ? t('openReview.hideResponse') : t('openReview.readResponse')
						}}
					</span>
				</span>
			</template>
		</PkpAccordionHeader>
		<PkpAccordionContent>
			<slot
				name="content"
				:round-id="roundId"
				:author-response="authorResponse"
			>
				<div :class="cn('content')">
					<p v-strip-unsafe-html="localize(authorResponse.response)"></p>
				</div>
			</slot>
		</PkpAccordionContent>
	</PkpAccordionItem>
</template>

<script setup>
import {computed} from 'vue';
import PkpAccordionItem from '@/frontend/components/PkpAccordion/PkpAccordionItem.vue';
import PkpAccordionHeader from '@/frontend/components/PkpAccordion/PkpAccordionHeader.vue';
import PkpAccordionContent from '@/frontend/components/PkpAccordion/PkpAccordionContent.vue';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpDate} from '@/frontend/composables/usePkpDate';
import {usePkpOpenReviewStore} from './usePkpOpenReviewStore';

const props = defineProps({
	roundId: {type: [String, Number], required: true},
	authorResponse: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviewItemAuthorResponse', props.styles);
const {t, localize} = usePkpLocalize();
const {formatLongDate} = usePkpDate();
const store = usePkpOpenReviewStore();

// Comma-separated list of the authors associated with this response
const authorNames = computed(() => {
	const authors = props.authorResponse?.associatedAuthors || [];
	const names = authors.map((a) => a.fullName).filter(Boolean);
	if (names.length) {
		return names.join(', ');
	}
	return props.authorResponse?.submittedByUser?.fullName || '';
});
</script>

<template>
	<section :class="cn('root')" aria-label="{{ title }}">
		<div :class="cn('header')">
			<div :class="cn('header-left')">
				<slot name="header-left">
					<h3 :class="cn('title')">
						{{ title }}
					</h3>
					<div v-if="subtitle" :class="cn('subtitle')">
						{{ subtitle }}
					</div>
				</slot>
			</div>
			<div :class="cn('header-right')">
				<slot name="header-right" />
			</div>
		</div>
		<slot>
			<PkpAccordionRoot
				:model-value="store.expandedContentIds"
				type="multiple"
				:class="cn('items')"
				@update:model-value="store.setExpandedContent"
			>
				<PkpOpenReview
					v-for="review in round.reviews"
					:key="review.id"
					:show-version="false"
				/>
			</PkpAccordionRoot>
		</slot>
	</section>
</template>

<script setup>
import {usePkpOpenReviewsStore} from './usePkpOpenReviewsStore';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import PkpOpenReview from './PkpOpenReview.vue';

const props = defineProps({
	title: {type: String, required: true},
	subtitle: {type: String, default: () => ''},
	styles: {type: Object, default: () => ({})},
});

const store = usePkpOpenReviewsStore();
const {cn} = usePkpStyles('PkpOpenReviewsList', props.styles);
</script>

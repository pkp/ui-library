<template>
	<PkpAccordionHeader as="div" :class="cn('root')">
		<div :class="cn('left')">
			<h3 :class="cn('title')">
				<ReviewIcon :class="cn('title-icon')" aria-hidden="true" />
				<span :class="cn('title-text')">
					{{ title }}
				</span>
			</h3>
			<div v-if="subtitle" :class="cn('subtitle')">
				{{ subtitle }}
			</div>
		</div>
		<template #indicator="{open}">
			<div :class="cn('right')">
				<div :class="cn('toggle')">
					<span :class="cn('toggle-text')">
						{{ open ? closeLabel : openLabel }}
					</span>
					<svg
						:class="cn('toggle-icon')"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M11.3933 14.7616L7 10.3683L7.86831 9.5L11.3933 13.025L14.9183 9.5L15.7866 10.3683L11.3933 14.7616Z"
							fill="currentColor"
						/>
					</svg>
				</div>
			</div>
		</template>
	</PkpAccordionHeader>
</template>

<script setup>
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import PkpAccordionHeader from '../PkpAccordion/PkpAccordionHeader.vue';

const props = defineProps({
	ReviewIcon: {type: Object, required: true},
	title: {type: String, required: true},
	subtitle: {type: String, default: () => ''},
	openLabel: {type: String, default: () => ''},
	closeLabel: {type: String, default: () => ''},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviewAccordianHeader', props.styles);
</script>

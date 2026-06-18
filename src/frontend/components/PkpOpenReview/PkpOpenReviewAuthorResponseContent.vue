<template>
	<div :class="cn('root')">
		<p v-strip-unsafe-html="localize(authorResponse.response)"></p>
	</div>
</template>

<script setup>
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';

const props = defineProps({
	authorResponse: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviewAuthorResponseContent', props.styles);
const {localize} = usePkpLocalize();
</script>

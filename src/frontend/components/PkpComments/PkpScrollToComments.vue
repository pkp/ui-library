<template>
	<div :class="cn('root')">
		<slot>
			<PkpScrollToCommentsAllComments />
			<PkpScrollToCommentsLogInto />
		</slot>
	</div>
</template>

<script setup>
import PkpScrollToCommentsAllComments from './PkpScrollToCommentsAllComments.vue';
import PkpScrollToCommentsLogInto from './PkpScrollToCommentsLogInto.vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpScrollToComments', props.styles);
</script>

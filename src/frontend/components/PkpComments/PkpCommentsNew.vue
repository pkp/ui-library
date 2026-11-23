<template>
	<div
		v-if="
			commentsStore.isLatestPublication(publication.id) &&
			!!commentsStore.getCurrentUser()
		"
		:class="cn('root')"
	>
		<slot></slot>
	</div>
</template>
<script setup>
import {usePkpCommentsStore} from './usePkpCommentsStore';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	publication: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpCommentsNew', props.styles);

const commentsStore = usePkpCommentsStore();
</script>

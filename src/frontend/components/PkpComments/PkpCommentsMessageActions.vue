<template>
	<PkpDropdownMenu
		v-if="!!commentsStore.getCurrentUser()"
		:class="cn('root')"
		:items="commentsStore.getCommentActions(publication.id, message)"
		@select="(actionName) => commentsStore[actionName](publication.id, message)"
	/>
</template>
<script setup>
import PkpDropdownMenu from '@/frontend/components/PkpDropdownMenu/PkpDropdownMenu.vue';
import {usePkpCommentsStore} from './usePkpCommentsStore';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	publication: {type: Object, required: true},
	message: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpCommentsMessageActions', props.styles);

const commentsStore = usePkpCommentsStore();
</script>

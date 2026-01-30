<template>
	<pkp-dropdown-menu
		v-if="!!commentsStore.getCurrentUser()"
		:class="cn('messageActions')"
		:items="commentsStore.getCommentActions(publication.id, message)"
		@select="(actionName) => commentsStore[actionName](publication.id, message)"
	/>
</template>
<script setup>
import {usePkpCommentsStore} from '../usePkpCommentsStore';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

defineProps({
	publication: {type: Object, required: true},
	message: {type: Object, required: true},
});

const {cn} = usePkpStyles('PkpComments');

const commentsStore = usePkpCommentsStore();
</script>

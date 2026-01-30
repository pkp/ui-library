<template>
	<pkp-button
		:class="cn('newSubmit')"
		:is-disabled="
			!commentsStore.commentText.trim() || commentsStore.isCommentSubmitting
		"
		@click="commentsStore.addComment(publication.id)"
	>
		{{ t('form.submit') }}
	</pkp-button>
</template>

<script setup>
import {usePkpCommentsStore} from '../usePkpCommentsStore';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

defineProps({
	publication: {type: Object, required: true},
});

const {cn} = usePkpStyles('PkpComments');

const {t} = usePkpLocalize();
const commentsStore = usePkpCommentsStore();
</script>

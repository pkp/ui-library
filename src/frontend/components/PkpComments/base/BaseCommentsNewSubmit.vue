<template>
	<pkp-button
		class="pkpComments__new-submit"
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

defineProps({
	publication: {type: Object, required: true},
});

const {t} = usePkpLocalize();
const commentsStore = usePkpCommentsStore();
</script>

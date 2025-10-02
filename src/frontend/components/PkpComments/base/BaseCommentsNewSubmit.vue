<template>
	<pkp-button
		class="BaseCommentsNewSubmit"
		:is-disabled="
			!commentsStore.commentText.trim() || commentsStore.isCommentSubmitting
		"
		@click="commentsStore.addComment(publicationId)"
	>
		{{ t('form.submit') }}
	</pkp-button>
</template>

<script setup>
import {inject} from 'vue';
import {usePkpCommentsStore} from '../usePkpCommentsStore';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';

const {t} = usePkpLocalize();
const publicationId = inject('publicationId');
const commentsStore = usePkpCommentsStore();
</script>

<template>
	<PkpButton
		:class="cn('newSubmit')"
		:is-disabled="
			!commentsStore.commentText.trim() || commentsStore.isCommentSubmitting
		"
		@click="commentsStore.addComment(publication.id)"
	>
		{{ t('form.submit') }}
	</PkpButton>
</template>

<script setup>
import PkpButton from '@/components/Button/Button.vue';
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

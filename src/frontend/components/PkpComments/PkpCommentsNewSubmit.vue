<template>
	<PkpButton
		:class="cn('root')"
		:is-disabled="
			!commentsStore.commentText.trim() || commentsStore.isCommentSubmitting
		"
		@click="commentsStore.addComment(publication.id)"
	>
		{{ t('form.submit') }}
	</PkpButton>
</template>

<script setup>
import PkpButton from '@/frontend/components/PkpButton/PkpButton.vue';
import {usePkpCommentsStore} from './usePkpCommentsStore';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	publication: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpCommentsNewSubmit', props.styles);

const {t} = usePkpLocalize();
const commentsStore = usePkpCommentsStore();
</script>

<template>
	<PkpButton
		is-secondary
		:is-disabled="!store.canRequestReviewRoundAuthorResponse"
		@click="store[action]"
	>
		{{ t('editor.submission.reviewRound.RequestResponse') }}
	</PkpButton>
</template>

<script setup>
import PkpButton from '@/components/Button/Button.vue';
import {useReviewRoundAuthorResponseRequestStore} from './AuthorResponseRequestManagerStore';
import {useLocalize} from '@/composables/useLocalize.js';

defineProps({
	action: {type: String, required: true},
	label: {type: String, required: true},
});

const {t} = useLocalize();
const store = useReviewRoundAuthorResponseRequestStore();
</script>

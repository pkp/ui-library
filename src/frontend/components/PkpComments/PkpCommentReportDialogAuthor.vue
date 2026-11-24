<template>
	<span v-strip-unsafe-html="message" :class="cn('root')" />
</template>
<script setup>
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import { computed } from 'vue';

const props = defineProps({
	comment: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpCommentReportDialogAuthor', props.styles);
const {t} = usePkpLocalize();

const message = computed(() => {
	return props.comment.userAffiliation
		? t('userComment.reportCommentByUserWithAffiliation', {
				name: props.comment.userName,
				affiliation: props.comment.userAffiliation,
			})
		: t('userComment.reportCommentBy', {
				name: props.comment.userName,
			})
})
</script>

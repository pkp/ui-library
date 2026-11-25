<template>
	<span v-strip-unsafe-html="message" :class="cn('root')" />
</template>
<script setup>
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpEscapeHtml} from '@/frontend/composables/usePkpEscapeHtml.js';
import {computed} from 'vue';

const props = defineProps({
	comment: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpCommentReportDialogAuthor', props.styles);
const {t} = usePkpLocalize();
const {escapeHtml} = usePkpEscapeHtml();

const message = computed(() => {
	const name = escapeHtml(props.comment.userName);
	const affiliation = escapeHtml(props.comment.userAffiliation ?? '');
	return props.comment.userAffiliation
		? t('userComment.reportCommentByUserWithAffiliation', {name, affiliation})
		: t('userComment.reportCommentBy', {name});
});
</script>

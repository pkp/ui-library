<template>
	<span :class="cn('root')">
		{{
			comment.userAffiliation
				? t('userComment.reportCommentByUserWithAffiliation', {
						userName: comment.userName,
						affiliation: comment.userAffiliation,
					})
				: t('userComment.reportCommentBy', {
						userName: comment.userName,
					})
		}}
	</span>
</template>
<script setup>
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	comment: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpCommentReportDialogAuthor', props.styles);
const {t} = usePkpLocalize();
</script>
